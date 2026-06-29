/**
 * Gamla Fjósið — "The Old Cowhouse"
 * Faithful implementation of the Claude Design handoff (design_handoff_gamlafjosid_landing):
 * an editorial broadsheet landing. Newsreader (display) + Hanken Grotesk (body) + Space Mono (labels).
 *
 * Fidelity notes:
 * - Exact tokens, type scale, spacing and copy from the handoff.
 * - Scroll-driven `fadeUp` reveals reproduced with the shared <Reveal> (IntersectionObserver),
 *   the marquee + steam keyframes live in a page <style> block, all gated by prefers-reduced-motion.
 * - Hover behaviour (lift + darken / lighten) is reproduced with scoped `gf-*` classes so the
 *   precise inline colours still win for the resting state.
 */

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Img } from '../../components/Img'
import { Reveal } from '../../components/Reveal'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'
import { setThemeColor } from '../../lib/preview'
import {
  IMAGES,
  RIBBON,
  STAGES,
  MENU,
  MENU_TABS,
  REVIEWS,
  TIME_SLOTS,
  type MenuCategory,
} from './data'

const company = getPreviewCompany('gamlafjosid')

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  cream:     '#F3ECDD',
  espresso:  '#241A12',
  darkWood:  '#1A120C',
  deep:      '#15100A',
  ember:     '#C2410C',
  emberCta:  '#9A3F12',
  emberGlow: '#E8915C',
  pasture:   '#4A5D3A',
  liveGreen: '#7BB668',
} as const

const PAGE_PAD = 'clamp(20px,5vw,64px)'

// ─── SCOPED STYLES (hover + keyframes, reduced-motion safe) ──────────────────
function PageStyles() {
  return (
    <style>{`
      @keyframes gfFadeUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:none } }
      @keyframes gfRibbon { from { transform:translateX(0) } to { transform:translateX(-50%) } }
      @keyframes gfSteam {
        0%   { opacity:0; transform:translateY(8px) scaleX(.85) }
        25%  { opacity:.55 }
        100% { opacity:0; transform:translateY(-46px) scaleX(1.25) }
      }
      .gf-marquee { animation: gfRibbon 34s linear infinite; }
      .gf-steam { animation: gfSteam 4.5s ease-in-out infinite; }

      .gf-link { transition: color .2s; }
      .gf-link:hover { color: #F3ECDD; }

      .gf-btn-primary { transition: transform .2s, background .2s; }
      .gf-btn-primary:hover { transform: translateY(-2px); background: #C2410C; }

      .gf-btn-ghost { transition: transform .2s; }
      .gf-btn-ghost:hover { transform: translateY(-2px); }

      .gf-btn-outline { transition: background .2s; }
      .gf-btn-outline:hover { background: rgba(36,26,18,.06); }

      .gf-btn-outline-dark { transition: background .2s; }
      .gf-btn-outline-dark:hover { background: rgba(243,236,221,.06); }

      .gf-soupchip { transition: transform .25s; }
      .gf-soupchip:hover { transform: translateY(-4px); }

      .gf-card { transition: background .2s, transform .2s; }
      .gf-card:hover { background: rgba(243,236,221,.09); transform: translateY(-3px); }

      .gf-tab { transition: background .2s, color .2s; }

      .gf-input { transition: border-color .2s, background .2s; }
      .gf-input:focus { border-color: #9A3F12; background: #fff; }

      .gf-step { transition: background .2s; }
      .gf-step:hover { background: rgba(36,26,18,.18); }

      @media (prefers-reduced-motion: reduce) {
        .gf-marquee, .gf-steam { animation: none !important; }
        .gf-steam { display: none; }
      }
    `}</style>
  )
}

// ─── NAV (over hero, not sticky) ─────────────────────────────────────────────
function Nav() {
  const links = [
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#story' },
    { label: 'Visit', href: '#visit' },
  ]
  return (
    <div
      className="relative z-[3] flex items-center justify-between gap-[18px]"
      style={{ padding: `24px ${PAGE_PAD}` }}
    >
      <a href="#top" className="flex items-baseline gap-[11px] no-underline">
        <span className="font-newsreader" style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-.01em', color: C.cream }}>
          Gamla Fjósið
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '.2em', color: 'rgba(243,236,221,.5)' }}>
          est. 1999
        </span>
      </a>
      <div className="flex items-center" style={{ gap: 'clamp(14px,2.4vw,30px)' }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="gf-link hidden sm:inline no-underline"
            style={{ fontSize: 13, fontWeight: 500, color: 'rgba(243,236,221,.82)' }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#visit"
          className="gf-btn-primary no-underline"
          style={{ fontSize: 13, fontWeight: 600, color: C.cream, padding: '9px 18px', borderRadius: 999, background: C.emberCta }}
        >
          Book a table
        </a>
      </div>
    </div>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="top"
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: '100vh', background: C.deep }}
    >
      <Img
        src={IMAGES.hero}
        alt="Hvassafell farm beneath Eyjafjallajökull"
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'saturate(.92) contrast(1.02)' }}
        fallbackClassName="absolute inset-0 bg-gradient-to-b from-[#3d2510] via-[#241a12] to-[#15100A]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,rgba(21,16,10,.66) 0%,rgba(21,16,10,.14) 26%,rgba(21,16,10,.16) 50%,rgba(21,16,10,.8) 86%,rgba(21,16,10,.97) 100%)' }}
      />

      <Nav />

      {/* Right-edge coordinate label (desktop only) */}
      <div
        aria-hidden
        className="absolute z-[3] hidden md:block font-mono uppercase"
        style={{
          right: 'clamp(18px,3vw,40px)', top: '50%',
          transform: 'translateY(-50%) rotate(180deg)', writingMode: 'vertical-rl',
          fontSize: 11, letterSpacing: '.34em', color: 'rgba(243,236,221,.4)',
        }}
      >
        63.55°N&nbsp;&nbsp;19.62°W — Suður&nbsp;Ísland
      </div>

      {/* Bottom-left content */}
      <div
        className="relative z-[3] mx-auto w-full"
        style={{ marginTop: 'auto', maxWidth: 1280, padding: `0 ${PAGE_PAD} clamp(40px,6vw,76px)` }}
      >
        <div className="flex flex-wrap items-end justify-between gap-10">
          <div style={{ maxWidth: 760 }}>
            <div className="mb-[22px] flex items-center gap-[14px]">
              <span style={{ width: 38, height: 1, background: C.emberGlow }} />
              <span className="font-mono uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', color: 'rgba(243,236,221,.78)' }}>
                Est. 1999 — undir Eyjafjöllum
              </span>
            </div>
            <h1
              className="font-newsreader"
              style={{ fontWeight: 500, fontSize: 'clamp(54px,9.2vw,134px)', lineHeight: 0.92, letterSpacing: '-.025em', color: C.cream }}
            >
              Beef raised<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>under a volcano.</span>
            </h1>
            <p style={{ marginTop: 26, maxWidth: 440, fontSize: 'clamp(16px,1.3vw,18px)', lineHeight: 1.62, color: 'rgba(243,236,221,.85)' }}>
              A working farm under Eyjafjallajökull since 1999. Own-herd free-range beef, garden salads, bread baked every morning — served in the old cowshed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="gf-btn-primary inline-flex items-center gap-[9px] no-underline"
                style={{ fontSize: 15, fontWeight: 600, color: C.cream, padding: '15px 28px', borderRadius: 999, background: C.emberCta }}
              >
                See the menu <span className="font-mono">→</span>
              </a>
              <a
                href="#visit"
                className="gf-btn-ghost no-underline"
                style={{ fontSize: 15, fontWeight: 600, color: C.cream, padding: '15px 28px', borderRadius: 999, border: '1.5px solid rgba(243,236,221,.4)', background: 'rgba(243,236,221,.06)' }}
              >
                Book a table
              </a>
            </div>
          </div>

          {/* Floating soup chip */}
          <a
            href="#soup"
            className="gf-soupchip relative block no-underline"
            style={{ width: 268, maxWidth: '100%', borderRadius: 20, overflow: 'hidden', background: 'rgba(21,16,10,.5)', border: '1px solid rgba(243,236,221,.16)', backdropFilter: 'blur(8px)' }}
          >
            <div className="relative" style={{ height: 150 }}>
              <Img
                src={IMAGES.soup}
                alt="Eldfjallasúpa, the Volcano Soup"
                className="h-full w-full object-cover"
                fallbackClassName="h-full w-full bg-gradient-to-br from-[#7a2e10] to-[#1a0a04]"
              />
              <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 120%,rgba(194,65,12,.5),transparent 62%)' }} />
            </div>
            <div style={{ padding: '15px 17px 17px' }}>
              <div className="font-mono uppercase" style={{ fontSize: 9.5, letterSpacing: '.18em', color: C.emberGlow }}>The house dish</div>
              <div className="font-newsreader" style={{ marginTop: 5, fontStyle: 'italic', fontSize: 21, color: C.cream }}>Eldfjallasúpa</div>
              <div className="mt-[9px] flex items-baseline justify-between">
                <span style={{ fontSize: 12.5, color: 'rgba(243,236,221,.62)' }}>The Volcano Soup</span>
                <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: C.cream }}>3.490 kr</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── MARQUEE RIBBON ──────────────────────────────────────────────────────────
function Ribbon() {
  const Group = () => (
    <>
      {RIBBON.map((word) => (
        <span key={word} className="flex items-center">
          <span style={{ padding: '0 28px', whiteSpace: 'nowrap' }}>{word}</span>
          <span style={{ padding: '0 28px', opacity: 0.55 }}>✳</span>
        </span>
      ))}
    </>
  )
  return (
    <div style={{ background: C.ember, overflow: 'hidden', borderTop: '1px solid rgba(21,16,10,.2)', borderBottom: '1px solid rgba(21,16,10,.2)' }}>
      <div
        className="gf-marquee font-newsreader flex"
        style={{ width: 'max-content', fontStyle: 'italic', fontSize: 24, color: C.cream, padding: '15px 0' }}
      >
        <div className="flex"><Group /></div>
        <div className="flex" aria-hidden><Group /></div>
      </div>
    </div>
  )
}

// ─── STORY ───────────────────────────────────────────────────────────────────
function Story() {
  return (
    <section id="story" className="mx-auto" style={{ maxWidth: 1280, padding: `clamp(64px,9vw,128px) ${PAGE_PAD}`, scrollMarginTop: 20 }}>
      <div className="grid items-center gap-[clamp(36px,5vw,80px)] md:grid-cols-[1.05fr_.95fr]">
        <Reveal>
          <div className="font-mono uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', color: C.emberCta, marginBottom: 18 }}>
            The farm — Hvassafell
          </div>
          <h2 className="font-newsreader" style={{ fontWeight: 500, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.02, letterSpacing: '-.02em', color: C.espresso }}>
            A farm that feeds<br />its <span style={{ fontStyle: 'italic' }}>own</span> restaurant.
          </h2>
          <p style={{ marginTop: 24, maxWidth: 480, fontSize: 16, lineHeight: 1.75, color: 'rgba(36,26,18,.72)' }}>
            Hvassafell sits directly beneath Eyjafjallajökull — the volcano that put South Iceland on the map in 2010. The restaurant opened in 1999 in a converted cowshed on that same land, same family, raising the cattle you can see from the window.
          </p>
          <p style={{ marginTop: 14, maxWidth: 480, fontSize: 16, lineHeight: 1.75, color: 'rgba(36,26,18,.72)' }}>
            The food is direct: own-herd beef, salads from the kitchen garden, sourdough baked each morning. Nothing imported when it can be grown or raised here.
          </p>
          <a href="#menu" className="gf-btn-outline mt-7 inline-flex items-center gap-[9px] no-underline" style={{ fontSize: 14, fontWeight: 600, color: C.espresso, padding: '12px 22px', borderRadius: 999, border: '1.5px solid rgba(36,26,18,.28)' }}>
            Read the story <span className="font-mono">→</span>
          </a>
        </Reveal>

        <Reveal delay={0.08} className="relative">
          <div aria-hidden className="absolute hidden md:block" style={{ inset: '18px -18px -22px 26px', background: C.pasture, borderRadius: 24 }} />
          <div className="relative overflow-hidden" style={{ borderRadius: 22, height: 'clamp(340px,42vw,520px)', boxShadow: '0 30px 60px -28px rgba(21,16,10,.55)' }}>
            <Img
              src={IMAGES.story}
              alt="Inside the old cowshed restaurant"
              className="h-full w-full object-cover"
              fallbackClassName="h-full w-full bg-gradient-to-br from-[#5c3018] to-[#241a12]"
            />
          </div>
          <div
            aria-hidden
            className="absolute hidden md:block font-mono uppercase"
            style={{ right: -6, bottom: -30, transform: 'rotate(90deg)', transformOrigin: 'right bottom', fontSize: 10, letterSpacing: '.2em', color: 'rgba(36,26,18,.42)' }}
          >
            Síðan 1999 — the old cowshed
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── SOUP FEATURE ────────────────────────────────────────────────────────────
function Soup() {
  return (
    <section id="soup" className="relative overflow-hidden" style={{ background: C.darkWood, scrollMarginTop: 20 }}>
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 22% 78%,rgba(194,65,12,.22),transparent 58%)' }} />
      <div className="relative mx-auto" style={{ maxWidth: 1280, padding: `clamp(56px,7vw,104px) ${PAGE_PAD}` }}>
        <div className="grid items-center gap-[clamp(36px,5vw,72px)] md:grid-cols-2">
          <Reveal className="relative">
            <div className="relative overflow-hidden" style={{ borderRadius: 26, height: 'clamp(320px,40vw,480px)' }}>
              <Img
                src={IMAGES.soup}
                alt="Eldfjallasúpa — the Volcano Soup"
                className="h-full w-full object-cover"
                fallbackClassName="h-full w-full bg-gradient-to-br from-[#7a2e10] to-[#1a0a04]"
              />
              <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 88%,rgba(194,65,12,.34),transparent 64%)' }} />
            </div>
            <div aria-hidden className="gf-steam absolute" style={{ left: '42%', top: '30%', width: 30, height: 60, borderRadius: '50%', background: 'rgba(243,236,221,.5)', filter: 'blur(9px)' }} />
            <div aria-hidden className="gf-steam absolute" style={{ left: '54%', top: '34%', width: 26, height: 54, borderRadius: '50%', background: 'rgba(243,236,221,.45)', filter: 'blur(9px)', animationDelay: '1.6s' }} />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="font-mono uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', color: C.emberGlow }}>
              The dish people drive out for
            </div>
            <h2 className="font-newsreader" style={{ marginTop: 12, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(46px,6vw,86px)', lineHeight: 1, letterSpacing: '-.02em', color: C.cream }}>
              Eldfjalla&shy;súpa
            </h2>
            <p style={{ marginTop: 22, maxWidth: 440, fontSize: 16, lineHeight: 1.75, color: 'rgba(243,236,221,.74)' }}>
              A powerful, hearty beef-and-vegetable soup, stock from our own herd, served with a basket of fresh-baked bread. The soup that started it all.
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-[18px]">
              <div className="inline-flex items-baseline gap-[9px]" style={{ padding: '16px 22px', borderRadius: 16, background: 'rgba(243,236,221,.07)', border: '1px solid rgba(243,236,221,.12)' }}>
                <span className="font-newsreader" style={{ fontSize: 30, fontWeight: 600, color: C.cream }}>3.490 kr</span>
                <span style={{ fontSize: 12.5, color: 'rgba(243,236,221,.55)' }}>with bread basket</span>
              </div>
              <a href="#menu" className="gf-btn-primary inline-flex items-center gap-[9px] no-underline" style={{ fontSize: 15, fontWeight: 600, color: C.cream, padding: '15px 26px', borderRadius: 999, background: C.emberCta }}>
                See the full menu <span className="font-mono">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── PROVENANCE TRAIL ────────────────────────────────────────────────────────
function Provenance() {
  return (
    <section className="mx-auto" style={{ maxWidth: 1280, padding: `clamp(64px,9vw,120px) ${PAGE_PAD}` }}>
      <div className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-newsreader" style={{ fontWeight: 500, fontSize: 'clamp(32px,4.4vw,60px)', lineHeight: 1.02, letterSpacing: '-.02em', color: C.espresso }}>
          From pasture to plate,<br /><span style={{ fontStyle: 'italic' }}>no detours.</span>
        </h2>
        <p style={{ maxWidth: 300, fontSize: 14.5, lineHeight: 1.65, color: 'rgba(36,26,18,.6)' }}>
          Four steps, all within sight of the dining room window.
        </p>
      </div>
      <div className="relative grid gap-[clamp(14px,1.6vw,22px)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div
          aria-hidden
          className="absolute hidden lg:block"
          style={{ top: 'clamp(100px,12vw,130px)', left: '12.5%', right: '12.5%', height: 1.5, background: 'repeating-linear-gradient(90deg,rgba(194,65,12,.5) 0 8px,transparent 8px 16px)', pointerEvents: 'none' }}
        />
        {STAGES.map((s, i) => (
          <Reveal key={s.num} delay={i * 0.08} className="relative">
            <div className="relative overflow-hidden" style={{ borderRadius: 18, height: 'clamp(180px,20vw,250px)' }}>
              <Img
                src={s.img}
                alt={s.label}
                className="h-full w-full object-cover"
                fallbackClassName="h-full w-full bg-gradient-to-br from-[#4a5d3a] to-[#241a12]"
              />
            </div>
            <div className="mt-[14px] flex items-baseline gap-[9px]">
              <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: C.emberCta }}>{s.num}</span>
              <span className="font-newsreader" style={{ fontSize: 19, fontWeight: 600, color: C.espresso }}>{s.label}</span>
            </div>
            <p style={{ marginTop: 7, fontSize: 13.5, lineHeight: 1.55, color: 'rgba(36,26,18,.66)', maxWidth: 200 }}>{s.caption}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── MENU ────────────────────────────────────────────────────────────────────
function Menu() {
  const [tab, setTab] = useState<MenuCategory>('Mains')
  return (
    <section id="menu" style={{ background: C.espresso, color: C.cream }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: `clamp(60px,8vw,116px) ${PAGE_PAD}` }}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', color: C.emberGlow }}>
              The menu — one page, honest
            </div>
            <h2 className="font-newsreader" style={{ marginTop: 12, fontWeight: 500, fontSize: 'clamp(34px,4.6vw,64px)', lineHeight: 1, letterSpacing: '-.02em', color: C.cream }}>
              Everything from<br />the <span style={{ fontStyle: 'italic' }}>same farm.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 280, fontSize: 14, lineHeight: 1.65, color: 'rgba(243,236,221,.6)' }}>
            All meat 100% free-range and unprocessed. Every burger and sandwich has a vegetarian option.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-[9px]" style={{ marginTop: 'clamp(34px,4vw,52px)' }}>
          {MENU_TABS.map((name) => {
            const active = name === tab
            return (
              <button
                key={name}
                onClick={() => setTab(name)}
                className="gf-tab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8915C]"
                style={{
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-hanken)', fontSize: 13,
                  padding: '9px 20px', borderRadius: 999, minHeight: 38,
                  fontWeight: active ? 600 : 500,
                  background: active ? C.cream : 'rgba(243,236,221,.08)',
                  color: active ? C.espresso : 'rgba(243,236,221,.7)',
                }}
              >
                {name}
              </button>
            )
          })}
        </div>

        {/* Items */}
        <div className="mt-6 grid gap-[clamp(12px,1.4vw,16px)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {MENU[tab].map((m) => (
            <div key={m.name} className="gf-card" style={{ borderRadius: 18, padding: '22px 24px', background: 'rgba(243,236,221,.05)', border: '1px solid rgba(243,236,221,.1)' }}>
              <div className="flex items-start justify-between gap-3">
                <span className="font-newsreader" style={{ fontSize: 18, fontWeight: 600, color: C.cream, lineHeight: 1.2 }}>{m.name}</span>
                <span className="font-mono" style={{ fontSize: 12.5, fontWeight: 700, color: C.emberGlow, whiteSpace: 'nowrap' }}>{m.price}</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, color: 'rgba(243,236,221,.62)' }}>{m.desc}</p>
            </div>
          ))}
        </div>

        <p className="font-mono" style={{ marginTop: 24, fontSize: 11, letterSpacing: '.08em', color: 'rgba(243,236,221,.45)' }}>
          Please let us know about any allergies. Verð í íslenskum krónum.
        </p>
      </div>
    </section>
  )
}

// ─── THE ROOM ────────────────────────────────────────────────────────────────
function Room() {
  return (
    <section className="mx-auto" style={{ maxWidth: 1280, padding: `clamp(64px,9vw,120px) ${PAGE_PAD}` }}>
      <div className="grid items-center gap-[clamp(36px,5vw,72px)] md:grid-cols-[.85fr_1.15fr]">
        <Reveal>
          <div className="font-mono uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', color: C.emberCta, marginBottom: 18 }}>
            The room
          </div>
          <h2 className="font-newsreader" style={{ fontWeight: 500, fontSize: 'clamp(32px,4.4vw,58px)', lineHeight: 1.02, letterSpacing: '-.02em', color: C.espresso }}>
            The old<br /><span style={{ fontStyle: 'italic' }}>cowshed.</span>
          </h2>
          <p style={{ marginTop: 22, maxWidth: 420, fontSize: 16, lineHeight: 1.75, color: 'rgba(36,26,18,.72)' }}>
            Original beams, stone walls, and the warmth of a building lived in for a century. The restaurant opened here in 1999 and the feeling has not changed since: unhurried, warm, genuinely Icelandic.
          </p>
          <a href="#visit" className="gf-btn-outline mt-[26px] inline-flex items-center gap-[9px] no-underline" style={{ fontSize: 14, fontWeight: 600, color: C.espresso, padding: '12px 22px', borderRadius: 999, border: '1.5px solid rgba(36,26,18,.28)' }}>
            Reserve a seat <span className="font-mono">→</span>
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="overflow-hidden" style={{ borderRadius: 24, height: 'clamp(320px,42vw,500px)', boxShadow: '0 30px 60px -28px rgba(21,16,10,.5)' }}>
            <Img
              src={IMAGES.cowshed}
              alt="Candlelit interior of the converted cowshed"
              className="h-full w-full object-cover"
              fallbackClassName="h-full w-full bg-gradient-to-br from-[#3d2010] to-[#1a0c06]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function Reviews() {
  return (
    <section style={{ background: C.espresso, color: C.cream }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: `clamp(60px,8vw,110px) ${PAGE_PAD}` }}>
        <div className="mb-[clamp(34px,4vw,52px)] flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-newsreader" style={{ fontWeight: 500, fontSize: 'clamp(30px,4vw,54px)', lineHeight: 1, letterSpacing: '-.02em', color: C.cream }}>
            What people<br /><span style={{ fontStyle: 'italic' }}>say.</span>
          </h2>
          <div className="flex items-center gap-[10px]">
            <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: C.emberGlow }}>5.0</span>
            <span style={{ fontSize: 13, color: 'rgba(243,236,221,.6)' }}>★★★★★ · Google reviews</span>
          </div>
        </div>
        <div className="grid gap-[clamp(12px,1.4vw,16px)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="flex flex-col justify-between" style={{ borderRadius: 18, padding: 24, background: 'rgba(243,236,221,.05)', border: '1px solid rgba(243,236,221,.1)' }}>
              <p className="font-newsreader" style={{ fontSize: 16, fontStyle: 'italic', lineHeight: 1.55, color: 'rgba(243,236,221,.9)' }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(243,236,221,.12)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.cream }}>{r.name}</div>
                <div className="font-mono" style={{ fontSize: 10.5, letterSpacing: '.06em', color: 'rgba(243,236,221,.5)', marginTop: 3 }}>{r.from}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOURS & BOOKING ─────────────────────────────────────────────────────────
function Visit() {
  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)

  const labelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'rgba(36,26,18,.5)', marginBottom: 7 }
  const inputStyle = { width: '100%', padding: '13px 16px', fontFamily: 'var(--font-hanken)', fontSize: 14, color: C.espresso, background: 'rgba(36,26,18,.04)', border: '1px solid rgba(36,26,18,.18)', borderRadius: 12, outline: 'none', minHeight: 48 }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Table request — ${date || 'date TBD'} at ${time || 'time TBD'} for ${guests} ${guests === 1 ? 'guest' : 'guests'}`)
    const body = encodeURIComponent(
      `Hello,\n\nI would like to request a table at Gamla Fjósið.\n\nName: ${name}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\n\nThank you.`
    )
    window.location.href = `mailto:info@gamlafjosid.is?subject=${subject}&body=${body}`
  }

  return (
    <section id="visit" className="mx-auto" style={{ maxWidth: 1280, padding: `clamp(64px,9vw,120px) ${PAGE_PAD}`, scrollMarginTop: 20 }}>
      <div className="grid gap-[clamp(36px,5vw,72px)] md:grid-cols-[.92fr_1.08fr]">
        {/* Hours */}
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', color: C.emberCta, marginBottom: 16 }}>
            Visit us
          </div>
          <h2 className="font-newsreader" style={{ fontWeight: 500, fontSize: 'clamp(30px,4vw,52px)', lineHeight: 1.02, letterSpacing: '-.02em', color: C.espresso }}>
            Hours &amp;<br /><span style={{ fontStyle: 'italic' }}>location.</span>
          </h2>
          <div style={{ marginTop: 28, borderRadius: 20, padding: '26px 28px', background: C.espresso, color: C.cream }}>
            <div className="mb-[18px] flex items-center gap-[10px]">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.liveGreen }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(243,236,221,.85)' }}>Open daily · 11:30 – 21:00</span>
            </div>
            <div style={{ borderRadius: 12, padding: '13px 16px', fontSize: 13, lineHeight: 1.6, background: 'rgba(194,65,12,.18)', border: '1px solid rgba(194,65,12,.3)', color: 'rgba(243,236,221,.78)', marginBottom: 18 }}>
              <strong style={{ color: C.cream }}>Seasonal closing.</strong> We close from mid-October and reopen in spring — call ahead if you are visiting outside summer.
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.9, color: 'rgba(243,236,221,.62)' }}>
              <div>Hvassafell, 861 Hvolsvöllur</div>
              <div>Tel: <a href="tel:+3544877788" style={{ color: 'rgba(243,236,221,.85)', textDecoration: 'none' }}>+354 487 7788</a></div>
              <div>Email: <a href="mailto:info@gamlafjosid.is" style={{ color: 'rgba(243,236,221,.85)', textDecoration: 'none' }}>info@gamlafjosid.is</a></div>
            </div>
            <a
              href="https://maps.google.com/maps?q=Hvassafell%2C%20Hvolsvollur%20861%20Iceland"
              target="_blank"
              rel="noopener noreferrer"
              className="gf-btn-outline-dark mt-5 inline-flex items-center gap-2 no-underline"
              style={{ fontSize: 13, fontWeight: 500, color: 'rgba(243,236,221,.8)', padding: '10px 20px', borderRadius: 999, border: '1.5px solid rgba(243,236,221,.24)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
              Open in Maps
            </a>
          </div>
        </div>

        {/* Booking form */}
        <div>
          <h3 className="font-newsreader" style={{ fontWeight: 500, fontSize: 'clamp(24px,2.6vw,36px)', letterSpacing: '-.01em', color: C.espresso }}>
            Request a table.
          </h3>
          <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(36,26,18,.6)' }}>
            We confirm by email or phone within one business day.
          </p>
          <form onSubmit={handleSubmit} className="mt-[26px] flex flex-col gap-4">
            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="gf-input" style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-[14px]">
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" required min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="gf-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Guests</label>
                <div className="flex items-center justify-between" style={{ padding: '7px 12px', background: 'rgba(36,26,18,.04)', border: '1px solid rgba(36,26,18,.18)', borderRadius: 12, minHeight: 48 }}>
                  <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="gf-step" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(36,26,18,.1)', color: C.espresso, fontSize: 17, lineHeight: 1, fontFamily: 'var(--font-hanken)' }}>−</button>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.espresso }}>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                  <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(14, g + 1))} className="gf-step" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(36,26,18,.1)', color: C.espresso, fontSize: 17, lineHeight: 1, fontFamily: 'var(--font-hanken)' }}>+</button>
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Preferred time</label>
              <select required value={time} onChange={(e) => setTime(e.target.value)} className="gf-input" style={inputStyle}>
                <option value="">Select a time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="gf-btn-primary" style={{ width: '100%', padding: 16, borderRadius: 999, border: 'none', cursor: 'pointer', background: C.emberCta, color: C.cream, fontFamily: 'var(--font-hanken)', fontSize: 14, fontWeight: 600 }}>
              Request a table
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section className="relative overflow-hidden" style={{ background: C.deep }}>
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 118%,rgba(194,65,12,.26),transparent 60%)' }} />
      <div className="relative mx-auto text-center" style={{ maxWidth: 760, padding: `clamp(80px,11vw,150px) ${PAGE_PAD}` }}>
        <div className="font-mono uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.24em', color: 'rgba(243,236,221,.5)' }}>
          Hvassafell · Eyjafjöll
        </div>
        <h2 className="font-newsreader" style={{ marginTop: 20, fontWeight: 500, fontSize: 'clamp(44px,6.5vw,92px)', lineHeight: 1.02, letterSpacing: '-.025em', color: C.cream }}>
          A meal worth<br /><span style={{ fontStyle: 'italic' }}>the drive.</span>
        </h2>
        <p style={{ marginTop: 18, fontSize: 15, color: 'rgba(243,236,221,.66)' }}>
          Mon–Sun 11:30–21:00 · Closed mid-October through spring
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-[14px]">
          <a href="#visit" className="gf-btn-primary no-underline" style={{ fontSize: 16, fontWeight: 600, color: C.cream, padding: '16px 36px', borderRadius: 999, background: C.emberCta }}>
            Book a table
          </a>
          <a href="tel:+3544877788" className="gf-btn-ghost no-underline" style={{ fontSize: 16, fontWeight: 600, color: C.cream, padding: '16px 36px', borderRadius: 999, border: '1.5px solid rgba(243,236,221,.32)' }}>
            +354 487 7788
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER (design's own) ───────────────────────────────────────────────────
function SiteFooter() {
  const explore = [
    { label: 'Menu', href: '#menu' },
    { label: 'About us', href: '#story' },
    { label: 'Hours & location', href: '#visit' },
    { label: 'Book a table', href: '#visit' },
  ]
  return (
    <footer style={{ background: C.darkWood, color: 'rgba(243,236,221,.6)' }}>
      <div className="mx-auto grid gap-10 grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr]" style={{ maxWidth: 1280, padding: `clamp(48px,6vw,72px) ${PAGE_PAD}` }}>
        <div>
          <div className="flex items-baseline gap-[11px]">
            <span className="font-newsreader" style={{ fontSize: 22, fontWeight: 600, color: C.cream }}>Gamla Fjósið</span>
            <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '.2em', color: 'rgba(243,236,221,.45)' }}>est. 1999</span>
          </div>
          <p style={{ marginTop: 14, maxWidth: 300, fontSize: 13.5, lineHeight: 1.7 }}>
            A small, family-owned restaurant on the farm Hvassafell, beneath Eyjafjallajökull in South Iceland.
          </p>
        </div>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(243,236,221,.4)', marginBottom: 14 }}>Explore</div>
          <div className="flex flex-col gap-[9px]" style={{ fontSize: 13.5 }}>
            {explore.map((l) => (
              <a key={l.label} href={l.href} className="gf-link no-underline" style={{ color: 'rgba(243,236,221,.7)' }}>{l.label}</a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(243,236,221,.4)', marginBottom: 14 }}>Contact</div>
          <div className="flex flex-col gap-[9px]" style={{ fontSize: 13.5 }}>
            <a href="tel:+3544877788" className="gf-link no-underline" style={{ color: 'rgba(243,236,221,.7)' }}>+354 487 7788</a>
            <a href="mailto:info@gamlafjosid.is" className="gf-link no-underline" style={{ color: 'rgba(243,236,221,.7)' }}>info@gamlafjosid.is</a>
            <span>Hvassafell, 861 Hvolsvöllur</span>
            <a href="https://www.facebook.com/gamlafjosid/" target="_blank" rel="noopener noreferrer" className="gf-link no-underline" style={{ color: 'rgba(243,236,221,.7)' }}>Facebook</a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(243,236,221,.1)' }}>
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4 font-mono" style={{ maxWidth: 1280, padding: `20px ${PAGE_PAD}`, fontSize: 11, color: 'rgba(243,236,221,.4)' }}>
          <span>© 2025 Gamla Fjósið — The Old Cowhouse</span>
          <span>63.55°N 19.62°W</span>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ROOT ───────────────────────────────────────────────────────────────
export default function Page() {
  useEffect(() => {
    document.title = 'Gamla Fjósið — The Old Cowhouse'
    setThemeColor('#15100A')
  }, [])

  return (
    <div className="font-hanken antialiased" style={{ background: C.cream, color: C.espresso }}>
      <PageStyles />
      <PreviewChrome company={company} />

      <Hero />
      <Ribbon />
      <Story />
      <Soup />
      <Provenance />
      <Menu />
      <Room />
      <Reviews />
      <Visit />
      <FinalCta />
      <SiteFooter />

      <PreviewFooter company={company} />
    </div>
  )
}
