// Offline submit/focus regression tests: node --test src/preview/polarhestar/Page.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('./Page.tsx', import.meta.url), 'utf8')
const ast = ts.createSourceFile('Page.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const nodes = []
const visit = (node) => { nodes.push(node); ts.forEachChild(node, visit) }
visit(ast)
const submit = nodes.find((n) => ts.isVariableDeclaration(n) && n.name.getText(ast) === 'submit').initializer
const focus = nodes.find((n) => ts.isCallExpression(n) && n.expression.getText(ast) === 'useEffect' && n.arguments[1]?.getText(ast) === '[status, errorField]').arguments[0]
const compile = (node, env) => {
  const js = ts.transpileModule(`const run = ${node.getText(ast)}`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText
  return Function(...Object.keys(env), `${js}; return run`)(...Object.values(env))
}

async function request(httpStatus, body, failure = false) {
  const result = { status: 'idle', field: null, kind: null, done: false, cleared: false }
  const env = {
    status: 'idle', tooFew: false, tour: { id: 'test', name: { en: 'Ride' }, times: ['10:00'] }, time: '10:00',
    date: '2027-06-01', adults: 1, children: 0, name: 'Guest', email: 'guest@example.org', phone: '+3541234567', note: '',
    timeOpen: () => true, lang: 'en', riders: [{ experience: 'some' }], total: 100, BOOKING_API: 'https://offline.invalid', AbortController,
    window: { setTimeout: () => 1, clearTimeout: () => { result.cleared = true } },
    fetch: async (_url, options) => {
      result.payload = JSON.parse(options.body)
      if (failure) throw new Error('Offline')
      return { status: httpStatus, ok: httpStatus >= 200 && httpStatus < 300, json: async () => body }
    },
    setStatus: (value) => { result.status = value },
    setErrorKind: (value) => { result.kind = value },
    setErrorField: (value) => { result.field = value },
    setDone: (value) => { result.done = value },
    setReceipt: (value) => { result.receipt = value }, stegaClean: (value) => value,
  }
  await compile(submit, env)({ preventDefault() {} })
  assert.equal(result.cleared, true)
  return result
}

test('422 maps each contact refusal, ignores server copy and retains the submitted details', async () => {
  for (const [code, field] of [['email-reserved', 'email'], ['email-domain-no-mail', 'email'], ['phone-invalid', 'phone'], ['name-invalid', 'name'], ['contact-blocked', 'email'], ['future-code', 'phone']]) {
    const result = await request(422, { ok: false, reason: 'contact-invalid', code, field, message: 'DO NOT DISPLAY' })
    assert.equal(result.kind, code === 'future-code' ? 'contact-invalid' : code)
    assert.equal(result.field, field)
    assert.equal(result.status, 'error')
    assert.equal(result.done, false)
    assert.deepEqual(result.payload.customer, { name: 'Guest', email: 'guest@example.org', phone: '+3541234567' })
  }
})

test('unknown/missing contact codes fall back and unrecognized fields never focus', async () => {
  for (const field of [undefined, 'address', '__proto__']) {
    const result = await request(422, { reason: 'contact-invalid', field })
    assert.equal(result.kind, 'contact-invalid')
    assert.equal(result.field, null)
  }
})

test('429 gives retry guidance without focusing a contact field', async () => {
  const result = await request(429, { ok: false, reason: 'rate-limited', field: 'email' })
  assert.equal(result.kind, 'rate-limited')
  assert.equal(result.field, null)
  assert.equal(result.status, 'error')
})

test('existing availability, generic, network and success outcomes stay intact', async () => {
  for (const [reason, expected] of [['OVER_CAPACITY', 'full'], ['ALREADY_BOOKED', 'full'], ['TOO_SOON', 'soon'], ...['CLOSED_DAY', 'OUT_OF_SEASON', 'OUTSIDE_HOURS', 'TOO_FAR_AHEAD', 'RESOURCE_INACTIVE'].map((r) => [r, 'day']), ['UNKNOWN', 'other']]) {
    assert.equal((await request(422, { ok: false, reasons: [reason] })).kind, expected)
  }
  assert.equal((await request(500, null)).kind, 'other')
  assert.equal((await request(0, null, true)).status, 'error')
  const success = await request(200, { ok: true, quote: { total: 120 } })
  assert.equal(success.status, 'idle')
  assert.equal(success.done, true)
  assert.equal(success.receipt.total, 120)
})

test('failed submit focuses only an existing visible field, for either input modality', () => {
  for (const modality of ['pointer', 'key']) {
    for (const field of ['name', 'email', 'phone']) {
      for (const state of ['visible', 'missing', 'detached', 'disabled', 'no-layout', 'hidden']) {
        let focused = 0
        const input = state === 'missing' ? null : {
          isConnected: state !== 'detached', disabled: state === 'disabled',
          getClientRects: () => state === 'no-layout' ? [] : [{}], focus: () => { focused++ },
        }
        compile(focus, {
          status: 'error', errorField: field,
          nameRef: { current: field === 'name' ? input : null }, emailRef: { current: field === 'email' ? input : null }, phoneRef: { current: field === 'phone' ? input : null },
          window: { getComputedStyle: () => ({ visibility: state === 'hidden' ? 'hidden' : 'visible' }) },
          document: { documentElement: { getAttribute: () => modality } },
        })()
        assert.equal(focused, state === 'visible' ? 1 : 0, `${modality}/${field}/${state}`)
      }
    }
  }
})

test('submit refuses an unavailable or stale departure before contacting the booking API', async () => {
  for (const time of ['09:00', null]) {
    let contacted = false
    await compile(submit, {
      status: 'idle', tooFew: false, tour: { times: ['09:00', '10:00'] }, time,
      timeOpen: () => false,
      fetch: () => { contacted = true },
    })({ preventDefault() {} })
    assert.equal(contacted, false)
  }
})
