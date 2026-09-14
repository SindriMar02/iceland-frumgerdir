/* Adds the four projects her site publishes that this build never had:
   Hús í Mosfellsbæ, Íbúð í Skuggahverfi, Arkitektónískt Kameljón and
   Eldhús í 107, sérsmíði. Copy is her own text from katrinisfeld.is
   (2026-09-14), in her voice. Photos are her own files from those pages
   (masters p-mosfellsbaer-*, p-ibudskugga-*, p-kameljon-*, p-eldhus107-*);
   alt text describes only what each photograph shows and names nothing she
   did not. One Kameljón photograph with a small child in it is left out.
   Run once: node .ki-four.cjs */
const fs = require('fs')
const K = 'src/preview/katrinisfeld/'
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const NEW = [
  {
    slug: 'hus-i-mosfellsbae',
    title: 'Hús í Mosfellsbæ',
    oldPath: '/verkefni/innanhusshonnun/hus-i-mosfellsbae/',
    lead: 'Hús frá 2006 yfirfarið, með betri hljóðvist, nýjum litum og sérteiknuðum innréttingum.',
    body: [
      'Í þessu verkefni var hús sem hannað var árið 2006 yfirfarið. Hljóðvistin var bætt með því að taka loftið niður að hluta yfir eyjunni, með hljóðvist í niðurtekna loftinu.',
      'Allt húsið var málað í flottum litum og innréttingar teiknaðar og hannaðar fyrir svefnganginn, skrifstofuna og sjónvarpsrýmið. Húsgögnum var skipt út fyrir ný og gluggatjöldum komið fyrir, með þessum skemmtilega árangri.',
    ],
    photos: [
      ['p-mosfellsbaer-0', 'Stofa með rauðum eggstól, bláum sófa og steinhlöðnum arni'],
      ['p-mosfellsbaer-1', 'Niðurtekið loft með viðarrimlum og hangandi ljósum yfir eyjunni'],
      ['p-mosfellsbaer-2', 'Sjónvarpsrými með sérteiknaðri innréttingu og bókahillu'],
      ['p-mosfellsbaer-3', 'Lágskápur með dökkri borðplötu og ljósum handföngum'],
    ],
    facts: [['Hlutverk', 'Endurhönnun innanhúss'], ['Staðsetning', 'Mosfellsbær']],
  },
  {
    slug: 'ibud-i-skuggahverfi',
    title: 'Íbúð í Skuggahverfi',
    oldPath: '/verkefni/innanhusshonnun/ibud-i-skuggahverfi/',
    lead: 'Íbúð með flottasta útsýnið, hönnuð til að halda léttleika í gegnum rýmið.',
    body: [
      'Íbúð í Skugganum með flottasta útsýnið. Öll hönnunin miðaðist við að halda léttleika í gegnum rýmið, og húsgögnin eru höfð færri en flottari til að skyggja ekki á útsýnið.',
      'Niðurtekna loftið í eldhúsinu kom mjög vel út, þar sem raufin eftir því endilöngu er látin ganga út um endann, og marmaraflísarnar á veggjunum halda í bjarta og flotta léttleikann sem íbúðin hefur.',
    ],
    photos: [
      ['p-ibudskugga-0', 'Útsýni úr íbúðinni yfir sjóinn og Esjuna'],
      ['p-ibudskugga-1', 'Niðurtekið loft í eldhúsinu með rauf sem gengur eftir því endilöngu'],
      ['p-ibudskugga-2', 'Eldhúsveggur klæddur marmaraflísum á móti dökkum innréttingum'],
      ['p-ibudskugga-3', 'Eldhúsið undir niðurtekna loftinu með hangandi ljósi'],
      ['p-ibudskugga-4', 'Borðkrókur með glerborði við gluggana'],
      ['p-ibudskugga-5', 'Setustofa með ljósum gluggatjöldum og dökkum sófa'],
      ['p-ibudskugga-6', 'Gangur með ljósu viðargólfi að gluggavegg'],
    ],
    facts: [['Hlutverk', 'Innanhússhönnun íbúðar'], ['Staðsetning', 'Skuggahverfi, Reykjavík']],
  },
  {
    slug: 'arkitektoniskt-kameljon',
    title: 'Arkitektónískt Kameljón',
    oldPath: '/verkefni/innanhusshonnun/kameljon/',
    lead: 'Fallegt eldra hús í Hafnarfirði með viðbyggingu og endurhönnun að innan sem utan.',
    body: [
      'Fallegt eldra hús í Hafnarfirðinum sem hefur fengið viðbyggingu og endurhönnun, bæði að innan og utan.',
      'Einnig var falleg kjallaraíbúð hönnuð í húsinu.',
    ],
    photos: [
      ['p-kameljon-0', 'Svefnherbergi undir súð með dökkum vegg og hvítu panelklæddu lofti'],
      ['p-kameljon-1', 'Barnahorn undir súð með hillum, dúkkuhúsi og eggstól'],
      ['p-kameljon-2', 'Stofa með dökkbláum veggjum og brúnum leðursófa'],
      ['p-kameljon-3', 'Eldhús með dökkum innréttingum og messingljósum á vegg'],
      ['p-kameljon-4', 'Súla og stigi á milli stofu og eldhúss'],
      ['p-kameljon-5', 'Sjónvarpsstofa með ryðrauðum vegg og gráum hornsófa'],
      ['p-kameljon-6', 'Eldhúsið séð úr stofunni með myndverkum á bláum vegg'],
      ['p-kameljon-7', 'Messingljós á vegg yfir hillu í eldhúsinu'],
      ['p-kameljon-8', 'Rennihurð úr við við ganginn'],
      ['p-kameljon-9', 'Grár sófi og myndverk á ljósum vegg'],
      ['p-kameljon-10', 'Rennihurð úr við inn í svefnherbergi'],
      ['p-kameljon-11', 'Garður og hvítt útihús við húsið'],
    ],
    facts: [['Hlutverk', 'Endurhönnun og viðbygging'], ['Staðsetning', 'Hafnarfjörður']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'eldhus-i-107-sersmidi',
    title: 'Eldhús í 107, sérsmíði',
    oldPath: '/verkefni/innanhusshonnun/eldhus-sersmidi/',
    lead: 'Eldhúsið flutt inn frá stofunni og opnað í gegn, með sérsmíðaðri eikarinnréttingu.',
    body: [
      'Hér var eldhúsið flutt í innra rýmið frá stofunni og opnað í gegn. Eldhúsið er bæði praktískt og stofulegt, þar sem stofan og eldhúsið eru í sama rýminu.',
      'Innréttingin er sérsmíðuð og liturinn á eikinni sérblandaður. Koparfilma var notuð á eyjuna stofumegin og einnig inni í tækjaskápnum, sem poppar upp eldhúsið og gerir það skemmtilegt og flott. Stólarnir eftir Daníel Magnússon fara einstaklega vel við.',
      'Myndirnar birtust í Hús og híbýli.',
    ],
    photos: [
      ['p-eldhus107-0', 'Eldhúsið opið inn í stofuna með eyju og háum innréttingum'],
      ['p-eldhus107-1', 'Opinn tækjaskápur í sérsmíðaðri eikarinnréttingu'],
      ['p-eldhus107-2', 'Skúffur í eyjunni séðar stofumegin'],
      ['p-eldhus107-3', 'Eyja með svartri borðplötu og hár skápur við gluggann'],
      ['p-eldhus107-4', 'Stofan sem deilir rými með eldhúsinu'],
    ],
    facts: [['Hlutverk', 'Hönnun eldhúss'], ['Gerð', 'Sérsmíði'], ['Staðsetning', '107 Reykjavík']],
  },
]

const block = (p) => [
  '  {',
  `    slug: ${q(p.slug)},`,
  `    title: ${q(p.title)},`,
  "    category: 'innanhusshonnun',",
  `    oldPath: ${q(p.oldPath)},`,
  `    lead: ${q(p.lead)},`,
  '    body: [',
  ...p.body.map((b) => `      ${q(b)},`),
  '    ],',
  '    photos: [',
  ...p.photos.map(([id, alt]) => `      P(${q(id)}, ${q(alt)}),`),
  '    ],',
  `    facts: [${p.facts.map(([k, v]) => `[${q(k)}, ${q(v)}]`).join(', ')}],`,
  ...(p.credit ? [`    credit: ${q(p.credit)},`] : []),
  '  },',
].join('\n')

let src = fs.readFileSync(K + 'projects.ts', 'utf8')
for (const p of NEW) if (src.includes(`slug: '${p.slug}'`)) throw new Error(`already present: ${p.slug}`)
const anchor = src.indexOf("    slug: 'sumarhus-i-olfusi',")
if (anchor < 0) throw new Error('anchor project not found')
const end = src.indexOf('\n  },\n', anchor) + '\n  },\n'.length
src = src.slice(0, end) + NEW.map(block).join('\n') + '\n' + src.slice(end)
fs.writeFileSync(K + 'projects.ts', src)

/* the English page said "twenty-three"; the count now follows the record */
let c = fs.readFileSync(K + 'content.ts', 'utf8')
const en = "'She is a member of FHI, the Icelandic association of furniture and interior architects. Her portfolio includes twenty-three projects across four categories:"
if (!c.includes(en)) throw new Error('EN count sentence not found')
c = c.replace(en, "`She is a member of FHI, the Icelandic association of furniture and interior architects. Her portfolio includes ${PROJECTS.length} projects across four categories:")
c = c.replace("and smaller single-room commissions.',", 'and smaller single-room commissions.`,')
c = c.replace("import { byCategory } from './projects'", "import { PROJECTS, byCategory } from './projects'")
if (!c.includes('${PROJECTS.length} projects across') || !c.includes("import { PROJECTS, byCategory }")) throw new Error('EN count edit failed')
fs.writeFileSync(K + 'content.ts', c)

console.log(`added ${NEW.length} projects (${NEW.reduce((s, p) => s + p.photos.length, 0)} photos); English count now dynamic`)
