import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag, X, Minus, Plus, Phone } from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  BRANDS, BUDGETS, CATEGORIES, DV_YEAR, EMAIL, EMAIL_HREF, FEATURED_HANDLES, FEATURED_STORY,
  FIRST_ADDRESS, FONTS, FOUNDED_YEAR, JSON_LD, KENNITALA, LEGAL_NAME, MAPS_URL, MOVED_YEAR, NAV,
  PHONE_DISPLAY, PHONE_HREF, PRICE_HARVEST_DATE, PRODUCTS, POSTCODE, SERVICES, SHOWROOM_QUOTE,
  WEEK, ADDRESS, budgetOf,
} from './data'
import type { Budget, Category, Product } from './data'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('gitarinn')

/* ── GÍTARINN · "VEGGURINN" ────────────────────────────────────────────────
   Reference system: the Coppermine dark-editorial-ecommerce template (see
   memory coppermine-design-system.md), reskinned for a 36-year-old Reykjavík
   musical-instrument shop instead of a streetwear label. Structure and
   motion vocabulary transplanted at reference fidelity; palette, type and
   copy are entirely new (see the shared brief's TRANSPLANT RULE).

   THE IDEA: their own showroom holds "um 200 gítarar og bassar uppstilltir"
   (their own words) but the live site hides all of it behind a bare category
   dropdown. The redesign IS the wall: the hero is a grid of their own real
   instruments, one tile per product, with the giant brand wordmark blended
   across it exactly like a gallery wall label.

   DEVICES (numbered, reference fidelity vs. coppermine-experimental/app.js
   and styles.css, adapted to real assets and React):
     1. Hero: mix-blend-mode:difference wordmark over a grayscale grid of the
        REAL catalogue (their own product photos, not one stock figure).
     2. Marquee: brand-name strip, seamless duplicate, pauses on hover.
     3. Product ledger card: framed panel, index number, grayscale to colour
        on hover, radial spotlight, price row, "Í körfu" add-to-cart action.
     4. Rolling-list category filter: title rolls up to an italic accent
        duplicate on hover; doubles as the live filter driving the rail.
     5. Horizontal scroll-hijack (GSAP pin + scrub) for the featured
        instrument story, with a progress hairline.
     6. Cart drawer ("Karfan"): slide-in, qty steppers, subtotal,
        localStorage-persisted, disclaimed checkout.
     7. Menu toggle: text roller + plus icon spinning to an X (GSAP).
   ────────────────────────────────────────────────────────────────────────── */

const BG = '#0e0c09'
const BG2 = '#17130c'
const PLATE = '#ece1cc'
const INK = '#f2ece1'
const DIM = '#a3937a'
const FAINT = '#4d4536'
const ACCENT = '#c9853f'
const LINE = 'rgba(242,236,225,.14)'

const isk = (n: number) => `${new Intl.NumberFormat('is-IS').format(n)} kr.`

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

const pad = (n: number) => String(n).padStart(2, '0')
const hhmm = (h: number) => `${pad(h)}:00`

const CAT_LABEL: Record<Category, string> = {
  rafmagnsgitarar: 'Rafmagnsgítarar',
  kassagitarar: 'Kassagítarar',
  klassiskir: 'Klassískir',
  bassar: 'Bassar',
  magnarar: 'Magnarar',
  aukahlutir: 'Aukahlutir',
}

/* ── cart ─────────────────────────────────────────────────────────────── */

interface CartLine {
  handle: string
  qty: number
}

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem('git_cart')
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

/* ── reveal: IntersectionObserver + CSS transitions, in-view-on-mount check
   plus a ~2s failsafe so nothing strands hidden (ledger craft rule #4). ── */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]'))
    if (reduced() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('git-in'))
      return
    }
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.94) el.classList.add('git-in')
    })
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('git-in')
            io.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    const failsafe = window.setTimeout(() => els.forEach((el) => el.classList.add('git-in')), 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])
}

/* ── drag-to-scroll for the product rail ─────────────────────────────── */
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false
    let sx = 0
    let sl = 0
    let moved = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      down = true
      moved = 0
      sx = e.clientX
      sl = el.scrollLeft
      el.classList.add('git-drag')
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const d = e.clientX - sx
      moved = Math.abs(d)
      el.scrollLeft = sl - d
    }
    const onUp = () => {
      down = false
      el.classList.remove('git-drag')
    }
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointerleave', onUp)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointerleave', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])
  return ref
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c9853f] focus-visible:ring-offset-[#0e0c09]'

/* ── small primitives ─────────────────────────────────────────────────── */

function SectionHead({ n, title, id }: { n?: string; title: string; id: string }) {
  return (
    <div className="git-head" data-rv>
      {n && (
        <span className="git-head__n" aria-hidden="true">
          {n}
        </span>
      )}
      <h2 id={id} className="git-head__t">
        {title}
      </h2>
    </div>
  )
}

/* ── DEVICE 3: product ledger card ───────────────────────────────────── */

function ProductCard({
  p,
  index,
  onAdd,
  added,
}: {
  p: Product
  index: number
  onAdd: (handle: string) => void
  added: boolean
}) {
  return (
    <article className="git-prod">
      <div className="git-prod__im">
        <span className="git-prod__ix" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
        <div className="git-prod__add">
          <span className="git-prod__addlabel">Verð</span>
          <button
            type="button"
            className={`git-addbtn ${added ? 'git-addbtn--added' : ''} ${FOCUS}`}
            onClick={() => onAdd(p.handle)}
          >
            {added ? 'Bætt í körfu' : 'Í körfu'}
          </button>
        </div>
      </div>
      <div className="git-prod__meta">
        <div>
          <div className="git-prod__name">{p.name}</div>
          <div className="git-prod__cat">({CAT_LABEL[p.category]})</div>
        </div>
        {p.originalPrice ? (
          <span className="git-prod__price">
            <s>{isk(p.originalPrice)}</s>
            {isk(p.price)}
          </span>
        ) : (
          <span className="git-prod__price">{isk(p.price)}</span>
        )}
      </div>
    </article>
  )
}

/* ── DEVICE 4: rolling-list category filter ──────────────────────────── */

function RollingCategory({
  cat,
  label,
  count,
  active,
  onSelect,
  thumb,
}: {
  cat: Category | 'allt'
  label: string
  count: string
  active: boolean
  onSelect: (c: Category | 'allt') => void
  thumb?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(cat)}
      className={`git-roll-item ${active ? 'git-roll-item--active' : ''} ${FOCUS}`}
      aria-pressed={active}
    >
      <span className="git-roll-clip">
        <span className="git-roll-move">
          <span className="git-roll-state">
            <span className="git-roll-h">{label}</span>
          </span>
          <span className="git-roll-state">
            <span className="git-roll-h git-roll-h--hover">{label}</span>
          </span>
        </span>
      </span>
      <span className="git-roll-cat">({count})</span>
      {thumb && (
        <span className="git-roll-img" aria-hidden="true">
          <img src={thumb} alt="" loading="lazy" />
          <span className="git-roll-img__tint" />
        </span>
      )}
    </button>
  )
}

/* ── DEVICE 6: cart drawer ────────────────────────────────────────────── */

function CartDrawer({
  open,
  onClose,
  lines,
  setQty,
  remove,
}: {
  open: boolean
  onClose: () => void
  lines: CartLine[]
  setQty: (handle: string, qty: number) => void
  remove: (handle: string) => void
}) {
  const [checkedOut, setCheckedOut] = useState(false)
  const byHandle = useMemo(() => new Map(PRODUCTS.map((p) => [p.handle, p])), [])
  const total = lines.reduce((sum, l) => {
    const p = byHandle.get(l.handle)
    return sum + (p ? p.price * l.qty : 0)
  }, 0)
  const count = lines.reduce((n, l) => n + l.qty, 0)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) setCheckedOut(false)
  }, [open])

  return (
    <div className="git-cart" aria-hidden={!open} role="dialog" aria-label="Karfan">
      <button
        type="button"
        className="git-cart__scrim"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-label="Loka körfu"
      />
      <div className="git-cart__panel">
        <div className="git-cart__head">
          <p className="git-cart__title">
            Karfan <span>({count})</span>
          </p>
          <button type="button" onClick={onClose} className={`git-cart__x ${FOCUS}`} aria-label="Loka körfu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="git-cart__items">
          {lines.length === 0 ? (
            <p className="git-cart__empty">Karfan er tóm.<br />Veldu hljóðfæri hér að neðan til að byrja.</p>
          ) : checkedOut ? (
            <p className="git-cart__empty">
              Þetta er frumgerð, svo greiðslugátt er ekki tengd.
              <br />
              Í raunverulegum vef myndi þetta senda ykkur í örugga greiðslu.
            </p>
          ) : (
            lines.map((l) => {
              const p = byHandle.get(l.handle)
              if (!p) return null
              return (
                <div key={l.handle} className="git-cart__it">
                  <div className="git-cart__im">
                    <img src={p.img} alt={p.name} loading="lazy" />
                  </div>
                  <div>
                    <div className="git-cart__n">{p.name}</div>
                    <div className="git-cart__qty">
                      <button
                        type="button"
                        aria-label="Fækka"
                        className={FOCUS}
                        onClick={() => setQty(l.handle, l.qty - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span>{l.qty}</span>
                      <button
                        type="button"
                        aria-label="Fjölga"
                        className={FOCUS}
                        onClick={() => setQty(l.handle, l.qty + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="git-cart__right">
                    <span className="git-cart__p">{isk(p.price * l.qty)}</span>
                    <button type="button" className={`git-cart__rm ${FOCUS}`} onClick={() => remove(l.handle)}>
                      Fjarlægja
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        <div className="git-cart__foot">
          <div className="git-cart__sum">
            <span className="git-cart__sumlabel">Samtals</span>
            <span className="git-cart__total">{isk(total)}</span>
          </div>
          <p className="git-cart__note">
            Þetta er frumgerð. Verð eru sótt af gitarinn.is {PRICE_HARVEST_DATE} en ekkert er í raun til sölu hér.
          </p>
          <button
            type="button"
            disabled={count === 0}
            className={`git-cart__go ${FOCUS}`}
            onClick={() => setCheckedOut(true)}
          >
            Ganga frá kaupum
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── DEVICE 7: menu toggle, text roller + plus-to-X spin ─────────────── */

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const iconRef = useRef<HTMLSpanElement>(null)
  const lineHRef = useRef<HTMLSpanElement>(null)
  const lineVRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const primed = useRef(false)
  const spin = useRef<gsap.core.Tween | null>(null)
  const roll = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (reduced()) {
      if (iconRef.current) gsap.set(iconRef.current, { rotate: open ? 225 : 0 })
      if (textRef.current) textRef.current.textContent = open ? 'Loka' : 'Valmynd'
      return
    }
    if (!primed.current && lineVRef.current && lineHRef.current && iconRef.current) {
      primed.current = true
      gsap.set(lineHRef.current, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(lineVRef.current, { rotate: 90, transformOrigin: '50% 50%' })
      gsap.set(iconRef.current, { rotate: 0, transformOrigin: '50% 50%' })
    }
    spin.current?.kill()
    if (iconRef.current) {
      spin.current = open
        ? gsap.to(iconRef.current, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' })
        : gsap.to(iconRef.current, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' })
    }
    roll.current?.kill()
    if (textRef.current) {
      const target = open ? 'Loka' : 'Valmynd'
      const current = textRef.current.textContent || (open ? 'Valmynd' : 'Loka')
      textRef.current.innerHTML = ''
      const a = document.createElement('span')
      a.className = 'git-sm-line'
      a.textContent = current
      const b = document.createElement('span')
      b.className = 'git-sm-line'
      b.textContent = target
      textRef.current.appendChild(a)
      textRef.current.appendChild(b)
      gsap.set(textRef.current, { yPercent: 0 })
      roll.current = gsap.to(textRef.current, { yPercent: -50, duration: 0.55, ease: 'power4.out' })
    }
  }, [open])

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? 'Loka valmynd' : 'Opna valmynd'}
      className={`git-burger ${FOCUS}`}
    >
      <span className="git-sm-wrap">
        <span ref={textRef} className="git-sm-inner">
          <span className="git-sm-line">Valmynd</span>
        </span>
      </span>
      <span ref={iconRef} className="git-sm-icon" aria-hidden="true">
        <span ref={lineHRef} className="git-sm-icon-line" />
        <span ref={lineVRef} className="git-sm-icon-line" />
      </span>
    </button>
  )
}

/* ── DEVICE 5: horizontal scroll-hijack featured story ───────────────── */

function FeaturedStory() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progRef = useRef<HTMLSpanElement>(null)
  const [fallback, setFallback] = useState(false)
  const dragRef = useDragScroll<HTMLDivElement>()

  const items = FEATURED_HANDLES.map((h) => PRODUCTS.find((p) => p.handle === h)).filter(
    (p): p is Product => Boolean(p),
  )

  useEffect(() => {
    setFallback(reduced())
  }, [])

  useEffect(() => {
    if (reduced() || !wrapRef.current || !trackRef.current) return
    const wrap = wrapRef.current
    const track = trackRef.current
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progRef.current) progRef.current.style.width = `${(self.progress * 100).toFixed(2)}%`
          },
        },
      })
    })
    return () => ctx.revert()
  }, [])

  if (fallback) {
    return (
      <section id="sviosljosid" aria-labelledby="story-h" className="git-pan git-pan--fallback">
        <SectionHead n="02" title="Í sviðsljósinu" id="story-h" />
        <div ref={dragRef} className="git-pan__scroll">
          <div className="git-pan__track">
            {items.map((p) => (
              <figure key={p.handle} className="git-pan__i">
                <img src={p.img} alt={p.name} loading="lazy" />
                <figcaption className="git-pan__cap">
                  <span className="git-pan__capname">{p.name}</span>
                  <span className="git-pan__capprice">{isk(p.price)}</span>
                  <span className="git-pan__capstory">{FEATURED_STORY[p.handle]}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="sviosljosid" ref={wrapRef} aria-labelledby="story-h" className="git-pan">
      <div className="git-pan__head">
        <SectionHead n="02" title="Í sviðsljósinu" id="story-h" />
      </div>
      <div ref={trackRef} className="git-pan__track">
        {items.map((p) => (
          <figure key={p.handle} className="git-pan__i">
            <img src={p.img} alt={p.name} loading="lazy" />
            <figcaption className="git-pan__cap">
              <span className="git-pan__capname">{p.name}</span>
              <span className="git-pan__capprice">{isk(p.price)}</span>
              <span className="git-pan__capstory">{FEATURED_STORY[p.handle]}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="git-pan__prog" aria-hidden="true">
        <span ref={progRef} />
      </div>
    </section>
  )
}

/* ── hours / status ───────────────────────────────────────────────────── */

interface Status {
  open: boolean
  today: (typeof WEEK)[number]
  clock: string
}

function readStatus(d: Date): Status {
  const dow = d.getDay()
  const h = d.getHours()
  const m = d.getMinutes()
  const today = WEEK.find((w) => w.day === dow) ?? WEEK[0]
  const dec = h + m / 60
  const open = !today.closed && dec >= today.open && dec < today.close
  return { open, today, clock: `${pad(h)}:${pad(m)}` }
}

/* ═══════════════════════════════════════════════════════════════════════ */

export default function GitarinnPage() {
  useReveal()
  useEffect(() => setThemeColor(BG), [])

  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartLine[]>(() => loadCart())
  const [activeCategory, setActiveCategory] = useState<Category | 'allt'>('allt')
  const [activeBudget, setActiveBudget] = useState<Budget | 'allt'>('allt')
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>(() => readStatus(new Date()))
  const railRef = useDragScroll<HTMLDivElement>()

  useEffect(() => {
    try {
      localStorage.setItem('git_cart', JSON.stringify(cart))
    } catch {
      /* private mode or full storage: cart just won't persist across reloads */
    }
  }, [cart])

  useEffect(() => {
    const t = window.setInterval(() => setStatus(readStatus(new Date())), 30000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  /* Lenis, nav hide-on-scroll and the marquee's seamless duplicate. The
     horizontal-pan device manages its own GSAP context inside FeaturedStory. */
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (reduced()) return
    let lenis: Lenis | undefined
    let lastY = 0
    const nav = navRef.current
    const onScroll = ({ scroll }: { scroll: number }) => {
      if (!nav) return
      if (scroll > lastY && scroll > 220) nav.classList.add('git-nav--hide')
      else nav.classList.remove('git-nav--hide')
      lastY = scroll
    }
    const ctx = gsap.context(() => {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      lenis.on('scroll', onScroll)
      gsap.ticker.add((t) => lenis?.raf(t * 1000))
      gsap.ticker.lagSmoothing(0)
    })
    return () => {
      ctx.revert()
      lenis?.destroy()
    }
  }, [])

  const addToCart = useCallback((handle: string) => {
    setCart((prev) => {
      const hit = prev.find((l) => l.handle === handle)
      if (hit) return prev.map((l) => (l.handle === handle ? { ...l, qty: l.qty + 1 } : l))
      return [...prev, { handle, qty: 1 }]
    })
    setCartOpen(true)
    setJustAdded(handle)
    window.setTimeout(() => setJustAdded((cur) => (cur === handle ? null : cur)), 900)
  }, [])

  const setQty = useCallback((handle: string, qty: number) => {
    setCart((prev) => {
      if (qty < 1) return prev.filter((l) => l.handle !== handle)
      return prev.map((l) => (l.handle === handle ? { ...l, qty } : l))
    })
  }, [])

  const removeLine = useCallback((handle: string) => {
    setCart((prev) => prev.filter((l) => l.handle !== handle))
  }, [])

  const cartCount = cart.reduce((n, l) => n + l.qty, 0)

  const filtered = PRODUCTS.filter(
    (p) =>
      (activeCategory === 'allt' || p.category === activeCategory) &&
      (activeBudget === 'allt' || budgetOf(p) === activeBudget),
  )

  const jumpToCatalogue = (cat: Category, budget: Budget) => {
    setActiveCategory(cat)
    setActiveBudget(budget)
    const el = document.getElementById('vorur')
    el?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
  }

  const wallProducts = PRODUCTS

  return (
    <div className="git-root" style={{ background: BG, color: INK, minHeight: '100vh' }}>
      <style>{PAGE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <PreviewChrome company={company} />

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <header ref={navRef} className="git-nav">
        <a href="#top" className={`git-nav__brand ${FOCUS}`} aria-label="Gítarinn, efst á síðu">
          Gítarinn
        </a>
        <nav className="git-nav__mid" aria-label="Aðalvalmynd">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`git-nav__link ${FOCUS}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="git-nav__end">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className={`git-nav__cart ${FOCUS}`}
            aria-label={`Opna körfu, ${cartCount} vörur`}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>({cartCount})</span>
          </button>
          <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
        </div>
      </header>

      {menuOpen && (
        <div className="git-menu" role="dialog" aria-label="Valmynd">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className={FOCUS}
            >
              {n.label}
            </a>
          ))}
          <a href={PHONE_HREF} onClick={() => setMenuOpen(false)} className={FOCUS}>
            {PHONE_DISPLAY}
          </a>
          <p className="git-menu__foot">
            {ADDRESS}, {POSTCODE}
            <br />
            <a href={EMAIL_HREF} className={FOCUS}>
              {EMAIL}
            </a>
          </p>
        </div>
      )}

      <main id="top">
        {/* ── DEVICE 1 · HERO ─────────────────────────────────────────── */}
        <section className="git-hero">
          <div className="git-hero__head">
            <p className="git-hero__eyebrow">Hljóðfæraverslun í Reykjavík frá {FOUNDED_YEAR}</p>
          </div>

          <div className="git-hero__wall">
            <div className="git-hero__tiles" aria-hidden="true">
              {wallProducts.map((p) => (
                <div key={p.handle} className="git-hero__tile">
                  <img src={p.img} alt="" loading="eager" />
                </div>
              ))}
            </div>
            <h1 className="git-hero__word">Gítarinn</h1>
          </div>

          <div className="git-hero__cta">
            <p className="git-hero__sub">
              200 hljóðfæri á vegg, rafmagns- og kassagítarar, bassar og magnarar, á sama stað frá {MOVED_YEAR}.
            </p>
            <div className="git-hero__btns">
              <a href="#vorur" className={`git-btn git-btn--fill ${FOCUS}`}>
                Skoða vörur
              </a>
              <a href={PHONE_HREF} className={`git-btn git-btn--line ${FOCUS}`}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* ── DEVICE 2 · MARQUEE (brands) ─────────────────────────────── */}
        <div className="git-marq">
          <div className="git-marq__t" aria-hidden="true">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i}>
                {b} <em>·</em>
              </span>
            ))}
          </div>
        </div>

        {/* ── DEVICE 3 + 4 · CATALOGUE ─────────────────────────────────── */}
        <section id="vorur" className="scroll-mt-24" aria-labelledby="cat-h">
          <SectionHead n="01" title="Vörurnar sjálfar" id="cat-h" />

          <div className="git-rolls" data-rv>
            <RollingCategory
              cat="allt"
              label="Allar vörur"
              count={String(PRODUCTS.length).padStart(2, '0')}
              active={activeCategory === 'allt'}
              onSelect={setActiveCategory}
            />
            {CATEGORIES.map((c) => {
              const thumb = PRODUCTS.find((p) => p.category === c.key)?.img
              return (
                <RollingCategory
                  key={c.key}
                  cat={c.key}
                  label={c.label}
                  count={String(PRODUCTS.filter((p) => p.category === c.key).length).padStart(2, '0')}
                  active={activeCategory === c.key}
                  onSelect={setActiveCategory}
                  thumb={thumb}
                />
              )
            })}
          </div>

          <div className="git-rail__wrap" data-rv>
            <div ref={railRef} className="git-rail">
              <div className="git-rail__t">
                {filtered.length === 0 ? (
                  <p className="git-rail__empty">Engin vara í þessum flokki eins og er.</p>
                ) : (
                  filtered.map((p, i) => (
                    <ProductCard key={p.handle} p={p} index={i} onAdd={addToCart} added={justAdded === p.handle} />
                  ))
                )}
              </div>
            </div>
          </div>
          <p className="git-price-note" data-rv>
            Verð sótt af gitarinn.is {PRICE_HARVEST_DATE}. Smelltu á hljóðfæri til að skoða það á núverandi vef þeirra.
          </p>
        </section>

        {/* ── DEVICE 5 · FEATURED STORY ─────────────────────────────────── */}
        <FeaturedStory />

        {/* ── SAGAN (heritage) ───────────────────────────────────────────── */}
        <section id="sagan" className="scroll-mt-24 git-heritage" aria-labelledby="heritage-h">
          <SectionHead n="03" title="Sagan" id="heritage-h" />
          <div className="git-heritage__grid" data-rv>
            <div className="git-heritage__num">
              <span className="git-heritage__year">{FOUNDED_YEAR}</span>
              <p>
                Gítarinn ehf. var stofnaður árið {FOUNDED_YEAR} og var til húsa að {FIRST_ADDRESS} allt til ársins{' '}
                {MOVED_YEAR}, þegar verslunin flutti að Stórhöfða 27, þar sem hún er enn í dag.
              </p>
            </div>
            <div className="git-heritage__num">
              <span className="git-heritage__year">200+</span>
              <p>
                Í versluninni eru að eigin sögn <em>{SHOWROOM_QUOTE}</em>, allt frá byrjendahljóðfærum upp í
                atvinnumannabúnað.
              </p>
            </div>
          </div>
          <p className="git-heritage__dv" data-rv>
            Gítarúrvalið er, að sögn DV árið {DV_YEAR}, á meðal þess mesta á landinu.
          </p>
          <p className="git-heritage__brandslabel" data-rv>
            Merkin á veggnum
          </p>
          <ul className="git-brandlist" data-rv>
            {BRANDS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        {/* ── DEVICE 4 (reuse) · GUIDE ───────────────────────────────────── */}
        <section id="leidarvisir" className="scroll-mt-24 git-guide" aria-labelledby="guide-h">
          <SectionHead n="04" title="Finna réttu hljóðfærið" id="guide-h" />
          <p className="git-guide__lead" data-rv>
            Veldu tegund og upphæð, og við hoppum beint á vörurnar sem passa.
          </p>
          <div className="git-guide__grid" data-rv>
            <div>
              <p className="git-guide__label">Tegund</p>
              <div className="git-guide__pills">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`git-pill ${activeCategory === c.key ? 'git-pill--active' : ''} ${FOCUS}`}
                    onClick={() => jumpToCatalogue(c.key, activeBudget === 'allt' ? 'milli' : activeBudget)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="git-guide__label">Upphæð</p>
              <div className="git-guide__pills">
                {BUDGETS.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    className={`git-pill ${activeBudget === b.key ? 'git-pill--active' : ''} ${FOCUS}`}
                    onClick={() =>
                      jumpToCatalogue(activeCategory === 'allt' ? 'rafmagnsgitarar' : activeCategory, b.key)
                    }
                  >
                    <span>{b.label}</span>
                    <span className="git-guide__pillnote">{b.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ÞJÓNUSTA (services) ─────────────────────────────────────────── */}
        <section id="thjonusta" className="scroll-mt-24 git-services" aria-labelledby="services-h">
          <SectionHead n="05" title="Þjónusta" id="services-h" />
          <div className="git-services__grid" data-rv>
            {SERVICES.map((s) => (
              <div key={s.title} className="git-services__it">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HEIMSÆKJA (visit) ───────────────────────────────────────────── */}
        <section id="heimsaekja" className="scroll-mt-24 git-visit" aria-labelledby="visit-h">
          <SectionHead n="06" title="Heimsækja" id="visit-h" />
          <div className="git-visit__grid" data-rv>
            <div>
              <p className="git-visit__status">
                <span
                  className="git-visit__dot"
                  style={{ background: status.open ? ACCENT : FAINT }}
                  aria-hidden="true"
                />
                {status.open ? 'Opið núna' : 'Lokað núna'} · {status.clock}
              </p>
              <ul className="git-hours">
                {WEEK.map((w) => (
                  <li key={w.day} className={w.day === status.today.day ? 'git-hours--today' : ''}>
                    <span>{w.label}</span>
                    <span>{w.closed ? 'Lokað' : `${hhmm(w.open)} til ${hhmm(w.close)}`}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="git-visit__card">
              <p className="git-visit__addr">
                {ADDRESS}
                <br />
                {POSTCODE}
              </p>
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className={`git-visit__maps ${FOCUS}`}>
                Opna í kortum
              </a>
              <a href={PHONE_HREF} className={`git-visit__phone ${FOCUS}`}>
                {PHONE_DISPLAY}
              </a>
              <a href={EMAIL_HREF} className={`git-visit__email ${FOCUS}`}>
                {EMAIL}
              </a>
            </div>
          </div>
        </section>

        {/* ── CLOSER ───────────────────────────────────────────────────────── */}
        <section className="git-closer" aria-labelledby="closer-h">
          <h2 id="closer-h">{status.open ? 'Það er opið. Kíktu við.' : 'Vörurnar bíða á Stórhöfða.'}</h2>
          <div className="git-closer__btns">
            <a href={PHONE_HREF} className={`git-btn git-btn--fill ${FOCUS}`}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
            <button type="button" onClick={() => setCartOpen(true)} className={`git-btn git-btn--line ${FOCUS}`}>
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Skoða körfu ({cartCount})
            </button>
          </div>
          <p className="git-closer__legal">
            {LEGAL_NAME} · kt. {KENNITALA} · {ADDRESS}, {POSTCODE}
          </p>
        </section>
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} lines={cart} setQty={setQty} remove={removeLine} />

      <PreviewFooter company={company} />
    </div>
  )
}

/* ── CSS ──────────────────────────────────────────────────────────────── */

const PAGE_CSS = `
@font-face { font-family: 'Git Display'; src: url('${FONTS.display}') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Git Mono'; src: url('${FONTS.monoRegular}') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Git Mono'; src: url('${FONTS.monoMedium}') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Git Mono'; src: url('${FONTS.monoSemiBold}') format('woff2'); font-weight: 600; font-display: swap; }
@font-face { font-family: 'Git Mono'; src: url('${FONTS.monoBold}') format('woff2'); font-weight: 700; font-display: swap; }

.git-root {
  --git-bg: ${BG}; --git-bg2: ${BG2}; --git-plate: ${PLATE};
  --git-ink: ${INK}; --git-dim: ${DIM}; --git-faint: ${FAINT};
  --git-accent: ${ACCENT}; --git-line: ${LINE};
  --git-ease: cubic-bezier(.19,1,.22,1);
  --git-ff-d: 'Git Display', 'Arial Narrow', sans-serif;
  --git-ff-m: 'Git Mono', ui-monospace, monospace;
  --git-pad: clamp(18px, 5vw, 84px);
  font-family: var(--git-ff-m);
  font-size: 15px;
  line-height: 1.5;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.git-root main, .git-root footer { position: relative; z-index: 1; }
.git-root img { display: block; max-width: 100%; }
.git-root a { color: inherit; text-decoration: none; }
.git-root button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }
.git-root ::selection { background: var(--git-accent); color: var(--git-bg); }
.git-root h1, .git-root h2, .git-root h3 {
  font-family: var(--git-ff-d); text-transform: uppercase; letter-spacing: .01em; font-weight: 400;
}

/* ── NAV ──────────────────────────────────────────────────────────────── */
.git-nav {
  position: sticky; top: 0; z-index: 40; height: 64px;
  display: flex; align-items: center; gap: 18px;
  padding: 0 var(--git-pad);
  background: rgba(14,12,9,.86); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--git-line);
  transition: transform .5s var(--git-ease);
}
.git-nav--hide { transform: translateY(-100%); }
.git-nav__brand {
  font-family: var(--git-ff-d); font-size: 1.3rem; letter-spacing: .02em; white-space: nowrap;
}
.git-nav__mid { display: none; gap: 22px; margin-left: 8px; }
.git-nav__link {
  font-family: var(--git-ff-m); font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
  color: var(--git-dim); transition: color .25s;
}
.git-nav__link:hover { color: var(--git-ink); }
.git-nav__end { margin-left: auto; display: flex; align-items: center; gap: 14px; }
.git-nav__cart {
  display: inline-flex; align-items: center; gap: 7px; min-height: 44px;
  font-family: var(--git-ff-m); font-size: 12.5px; letter-spacing: .04em; color: var(--git-ink);
}
.git-nav__cart:hover { color: var(--git-accent); }

.git-burger {
  display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 2px;
  font-family: var(--git-ff-m); font-size: 12px; letter-spacing: .08em; text-transform: uppercase;
}
.git-sm-wrap { position: relative; display: inline-block; height: 1em; overflow: hidden; }
.git-sm-inner { display: flex; flex-direction: column; line-height: 1; }
.git-sm-line { display: block; height: 1em; line-height: 1; white-space: nowrap; }
.git-sm-icon { position: relative; width: 13px; height: 13px; flex: 0 0 13px; display: inline-flex; }
.git-sm-icon-line {
  position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor;
  border-radius: 2px; transform: translate(-50%,-50%);
}

.git-menu {
  position: fixed; inset: 64px 0 0 0; z-index: 39; background: var(--git-bg);
  border-top: 1px solid var(--git-line);
  display: flex; flex-direction: column; gap: 4px; padding: 26px var(--git-pad);
}
.git-menu a {
  font-family: var(--git-ff-d); font-size: clamp(28px, 9vw, 44px); padding: 8px 0;
  border-bottom: 1px solid var(--git-line);
}
.git-menu__foot {
  margin-top: 20px; font-family: var(--git-ff-m); font-size: 12.5px; color: var(--git-dim); line-height: 1.9;
}
.git-menu__foot a { color: var(--git-accent); }

/* ── HERO (device 1) ──────────────────────────────────────────────────── */
.git-root section.git-hero { min-height: 100svh; display: flex; flex-direction: column; padding: 26px var(--git-pad) clamp(22px,3vw,40px); }
.git-hero__head { display: flex; }
.git-hero__eyebrow {
  font-family: var(--git-ff-m); font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--git-dim);
}
.git-hero__wall {
  position: relative; flex: 1; margin: 18px 0;
  border: 1px solid var(--git-line); overflow: hidden; border-radius: 2px;
  min-height: 0;
}
.git-hero__tiles {
  position: absolute; inset: 0;
  display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(3, 1fr); gap: 1px;
  background: var(--git-line);
}
.git-hero__tile {
  position: relative; overflow: hidden; min-height: 0; min-width: 0;
  background: radial-gradient(120% 100% at 50% 8%, var(--git-bg2), var(--git-bg) 70%);
}
.git-hero__tile img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 13%;
  filter: grayscale(1) brightness(.62) contrast(1.12);
}
.git-hero__word {
  position: absolute; left: 0; right: 0; top: 50%; margin: 0; text-align: center; padding: 0 4%;
  transform: translateY(-50%);
  font-size: clamp(52px, 12.5vw, 210px); line-height: .86; color: var(--git-accent);
  mix-blend-mode: difference; z-index: 3; pointer-events: none;
}
.git-hero__cta { display: flex; flex-direction: column; gap: 18px; }
.git-hero__sub { max-width: 52ch; font-size: clamp(1rem, 2vw, 1.14rem); line-height: 1.55; color: var(--git-ink); }
.git-hero__btns { display: flex; flex-wrap: wrap; gap: 12px; }

.git-btn {
  display: inline-flex; align-items: center; gap: 9px; min-height: 50px; padding: 0 24px;
  border-radius: 999px; font-family: var(--git-ff-m); font-size: 13px; font-weight: 600;
  letter-spacing: .04em; text-transform: uppercase; white-space: nowrap;
  transition: transform .25s var(--git-ease), background-color .25s, border-color .25s, color .25s;
}
.git-btn:active { transform: scale(.97); }
.git-btn--fill { background: var(--git-accent); color: var(--git-bg); }
.git-btn--fill:hover { background: var(--git-ink); }
.git-btn--line { border: 1px solid var(--git-line); color: var(--git-ink); }
.git-btn--line:hover { border-color: var(--git-accent); color: var(--git-accent); }

/* ── MARQUEE (device 2) ───────────────────────────────────────────────── */
.git-marq { border-top: 1px solid var(--git-line); border-bottom: 1px solid var(--git-line); overflow: hidden; padding: 14px 0; }
.git-marq__t {
  display: flex; align-items: center; gap: 26px; width: max-content; white-space: nowrap;
  font-family: var(--git-ff-d); font-size: clamp(22px, 3.6vw, 34px); text-transform: uppercase;
  letter-spacing: .01em; line-height: 1; animation: git-marq-move 30s linear infinite;
}
.git-marq__t em { color: var(--git-accent); font-style: normal; font-size: .6em; margin-left: 6px; }
@keyframes git-marq-move { to { transform: translateX(-50%); } }
.git-marq:hover .git-marq__t { animation-play-state: paused; }

/* ── section rhythm ───────────────────────────────────────────────────── */
.git-root section { padding: clamp(64px,10vw,140px) 0; position: relative; }
.git-head { display: flex; align-items: baseline; gap: clamp(10px,2vw,22px); padding: 0 var(--git-pad); margin-bottom: clamp(30px,5vw,60px); }
.git-head__n { flex: 0 0 auto; min-width: clamp(26px,3vw,44px); font-family: var(--git-ff-m); font-size: 12px; color: var(--git-accent); }
.git-head__t { font-size: clamp(36px,6.4vw,84px); }

/* ── CATALOGUE: rolling-list category filter (device 4) ───────────────── */
.git-rolls { padding: 0 var(--git-pad); display: flex; flex-direction: column; border-top: 1px solid var(--git-line); margin-bottom: clamp(30px,5vw,60px); }
.git-roll-item { position: relative; display: block; width: 100%; text-align: left; border-bottom: 1px solid var(--git-line); padding: clamp(12px,2vw,20px) 0; }
.git-roll-clip { position: relative; overflow: hidden; height: clamp(38px,6vw,66px); }
.git-roll-move { transition: transform .55s cubic-bezier(.76,0,.24,1); }
.git-roll-item:hover .git-roll-move { transform: translateY(-50%); }
.git-roll-state { height: clamp(38px,6vw,66px); display: flex; align-items: center; }
.git-roll-h { font-family: var(--git-ff-d); font-size: clamp(28px,5vw,54px); line-height: 1; text-transform: uppercase; color: var(--git-ink); }
.git-roll-h--hover { font-style: italic; color: var(--git-accent); }
.git-roll-item--active .git-roll-h { color: var(--git-accent); }
.git-roll-cat { position: absolute; top: clamp(14px,2vw,22px); right: 0; font-family: var(--git-ff-m); font-size: 10.5px; letter-spacing: .1em; color: var(--git-dim); transition: opacity .3s; }
.git-roll-item:hover .git-roll-cat { opacity: 0; }
.git-roll-img {
  pointer-events: none; position: absolute; right: clamp(20px,8vw,120px); top: 50%; z-index: 5;
  height: clamp(70px,10vw,120px); width: clamp(100px,14vw,180px); overflow: hidden; border: 1px solid var(--git-line);
  background: var(--git-plate); transform: translateY(-50%) translateX(14px) scale(.94) rotate(2deg); opacity: 0;
  transition: all .45s var(--git-ease); border-radius: 2px;
}
.git-roll-item:hover .git-roll-img { opacity: 1; transform: translateY(-50%) translateX(0) scale(1) rotate(0); }
.git-roll-img img { width: 100%; height: 100%; object-fit: contain; padding: 8%; }
.git-roll-img__tint { position: absolute; inset: 0; background: rgba(201,133,63,.12); }

/* ── product ledger card (device 3) ───────────────────────────────────── */
.git-rail__wrap { padding: 0 0 0 var(--git-pad); }
.git-rail { overflow-x: auto; overflow-y: hidden; scrollbar-width: none; cursor: grab; -webkit-overflow-scrolling: touch; }
.git-rail::-webkit-scrollbar { display: none; }
.git-rail.git-drag { cursor: grabbing; }
.git-rail__t { display: flex; gap: clamp(16px,2vw,28px); width: max-content; padding: 4px var(--git-pad) 10px 0; }
.git-rail__empty { font-family: var(--git-ff-m); font-size: 13px; color: var(--git-dim); padding: 20px 0; }
.git-prod { width: clamp(210px,24vw,290px); flex: 0 0 auto; animation: git-card-in .5s var(--git-ease) both; }
@keyframes git-card-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.git-prod__im { position: relative; display: block; aspect-ratio: 4/5; overflow: hidden; background: var(--git-plate); border-radius: 2px; }
.git-prod__ix { position: absolute; top: 10px; left: 12px; z-index: 2; font-family: var(--git-ff-m); font-size: 10px; letter-spacing: .08em; color: rgba(20,15,8,.42); }
.git-prod__im img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 13%; filter: grayscale(1); transition: filter .8s var(--git-ease), transform 1s var(--git-ease); }
.git-prod:hover .git-prod__im img { filter: grayscale(0); transform: scale(1.035); }
.git-prod__add {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 10px 11px; background: linear-gradient(0deg, rgba(20,15,8,.16), transparent);
  opacity: 0; transform: translateY(6px); transition: opacity .35s var(--git-ease), transform .35s var(--git-ease);
}
.git-prod:hover .git-prod__add, .git-prod:focus-within .git-prod__add { opacity: 1; transform: none; }
@media (hover: none) { .git-prod__add { opacity: 1; transform: none; } .git-prod__im img { filter: grayscale(0); } }
.git-prod__addlabel { font-family: var(--git-ff-m); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: rgba(20,15,8,.65); }
.git-addbtn {
  min-height: 32px; padding: 7px 12px; border: 1px solid rgba(20,15,8,.28); border-radius: 999px;
  font-family: var(--git-ff-m); font-size: 10.5px; text-transform: uppercase; letter-spacing: .04em; color: #14100a;
  background: rgba(255,255,255,.55); transition: .25s var(--git-ease);
}
.git-addbtn:hover { background: var(--git-accent); border-color: var(--git-accent); color: var(--git-bg); }
.git-addbtn--added { background: var(--git-accent); border-color: var(--git-accent); color: var(--git-bg); }
.git-prod__meta { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--git-line); }
.git-prod__name { font-family: var(--git-ff-m); font-size: 12px; text-transform: uppercase; letter-spacing: .02em; line-height: 1.35; }
.git-prod__cat { font-family: var(--git-ff-m); font-size: 10px; color: var(--git-dim); margin-top: 4px; }
.git-prod__price { font-family: var(--git-ff-m); font-size: 12px; color: var(--git-accent); white-space: nowrap; }
.git-prod__price s { color: var(--git-faint); margin-right: 6px; }
.git-price-note { margin-top: 22px; padding: 0 var(--git-pad); font-family: var(--git-ff-m); font-size: 11px; color: var(--git-dim); line-height: 1.6; }

/* ── DEVICE 5: horizontal scroll-hijack ───────────────────────────────── */
.git-pan { overflow: hidden; padding: clamp(64px,10vw,140px) 0; }
.git-pan__head { padding-top: 4px; }
.git-pan__track, .git-pan__scroll .git-pan__track { display: flex; align-items: stretch; gap: clamp(14px,2vw,32px); height: 62vh; min-height: 380px; width: max-content; padding: 0 var(--git-pad); will-change: transform; }
.git-pan__i { flex: 0 0 auto; width: min(72vw, 460px); height: 100%; position: relative; overflow: hidden; background: var(--git-plate); border: 1px solid var(--git-line); border-radius: 2px; }
.git-pan__i img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 12%; filter: grayscale(1); transition: filter 1s var(--git-ease), transform 1.1s var(--git-ease); }
.git-pan__i:hover img { filter: grayscale(0); transform: scale(1.03); }
.git-pan__cap { position: absolute; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; background: linear-gradient(0deg, rgba(236,225,204,.96), rgba(236,225,204,.55) 65%, transparent); }
.git-pan__capname { font-family: var(--git-ff-m); font-size: 12.5px; text-transform: uppercase; letter-spacing: .02em; color: #14100a; }
.git-pan__capprice { font-family: var(--git-ff-m); font-size: 12px; color: #6a4118; }
.git-pan__capstory { font-family: var(--git-ff-m); font-size: 11px; color: rgba(20,15,8,.72); line-height: 1.5; max-width: 40ch; }
.git-pan__prog { position: absolute; bottom: clamp(16px,2.6vw,30px); left: var(--git-pad); right: var(--git-pad); height: 1px; background: var(--git-line); z-index: 4; }
.git-pan__prog span { display: block; height: 100%; width: 0; background: var(--git-accent); }
.git-pan--fallback .git-pan__scroll { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; cursor: grab; }
.git-pan--fallback .git-pan__scroll.git-drag { cursor: grabbing; }
.git-pan--fallback .git-pan__track { height: 56vh; min-height: 340px; }

/* ── heritage / brands ─────────────────────────────────────────────────── */
.git-heritage__grid { padding: 0 var(--git-pad); display: grid; gap: clamp(20px,4vw,50px); grid-template-columns: repeat(2, 1fr); }
.git-heritage__num { border-top: 1px solid var(--git-line); padding-top: 18px; }
.git-heritage__year { display: block; font-family: var(--git-ff-d); font-size: clamp(38px,6vw,64px); color: var(--git-accent); line-height: 1; margin-bottom: 10px; }
.git-heritage__num p { max-width: 46ch; color: var(--git-ink); line-height: 1.6; }
.git-heritage__num p em { color: var(--git-accent); font-style: normal; }
.git-heritage__dv { margin: clamp(28px,4vw,48px) var(--git-pad) 0; font-family: var(--git-ff-m); font-size: 12.5px; color: var(--git-dim); max-width: 60ch; line-height: 1.6; }
.git-heritage__brandslabel { margin: clamp(30px,5vw,54px) var(--git-pad) 14px; font-family: var(--git-ff-m); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--git-dim); }
.git-brandlist { padding: 0 var(--git-pad); display: flex; flex-wrap: wrap; gap: 10px; list-style: none; }
.git-brandlist li { font-family: var(--git-ff-m); font-size: 12.5px; padding: 9px 15px; border: 1px solid var(--git-line); border-radius: 999px; color: var(--git-ink); }

/* ── guide ─────────────────────────────────────────────────────────────── */
.git-guide__lead { padding: 0 var(--git-pad); max-width: 54ch; color: var(--git-dim); line-height: 1.6; margin-bottom: clamp(24px,4vw,40px); }
.git-guide__grid { padding: 0 var(--git-pad); display: grid; gap: clamp(24px,4vw,48px); grid-template-columns: repeat(2, 1fr); }
.git-guide__label { font-family: var(--git-ff-m); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--git-dim); margin-bottom: 14px; }
.git-guide__pills { display: flex; flex-wrap: wrap; gap: 10px; }
.git-pill {
  display: inline-flex; flex-direction: column; align-items: flex-start; gap: 3px; min-height: 46px;
  padding: 9px 16px; border: 1px solid var(--git-line); border-radius: 14px; font-family: var(--git-ff-m);
  font-size: 12.5px; color: var(--git-ink); transition: border-color .25s, color .25s, background-color .25s;
}
.git-pill:hover { border-color: var(--git-accent); color: var(--git-accent); }
.git-pill--active { background: var(--git-accent); border-color: var(--git-accent); color: var(--git-bg); }
.git-guide__pillnote { font-size: 10.5px; color: var(--git-dim); }
.git-pill--active .git-guide__pillnote { color: rgba(14,12,9,.85); }

/* ── services ──────────────────────────────────────────────────────────── */
.git-services__grid { padding: 0 var(--git-pad); display: grid; gap: clamp(22px,3vw,32px); grid-template-columns: repeat(2, 1fr); }
.git-services__it { border-top: 1px solid var(--git-line); padding-top: 16px; }
.git-services__it h3 { font-family: var(--git-ff-d); font-size: clamp(20px,2.6vw,28px); margin-bottom: 8px; }
.git-services__it p { color: var(--git-dim); line-height: 1.6; max-width: 40ch; }

/* ── visit ─────────────────────────────────────────────────────────────── */
.git-visit__grid { padding: 0 var(--git-pad); display: grid; gap: clamp(30px,5vw,64px); grid-template-columns: 1.1fr .9fr; }
.git-visit__status { display: flex; align-items: center; gap: 10px; font-family: var(--git-ff-m); font-size: 13px; margin-bottom: 20px; }
.git-visit__dot { width: 9px; height: 9px; border-radius: 999px; display: inline-block; flex: 0 0 auto; }
.git-hours { border-top: 1px solid var(--git-line); }
.git-hours li { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--git-line); font-family: var(--git-ff-m); font-size: 13px; color: var(--git-dim); }
.git-hours li.git-hours--today { color: var(--git-ink); }
.git-visit__card { border: 1px solid var(--git-line); border-radius: 4px; padding: clamp(22px,3vw,32px); display: flex; flex-direction: column; gap: 14px; align-self: start; }
.git-visit__addr { font-family: var(--git-ff-d); font-size: clamp(22px,3vw,30px); line-height: 1.1; }
.git-visit__maps, .git-visit__phone, .git-visit__email { display: inline-flex; align-items: center; min-height: 40px; font-family: var(--git-ff-m); font-size: 13px; color: var(--git-accent); width: fit-content; }
.git-visit__maps:hover, .git-visit__phone:hover, .git-visit__email:hover { color: var(--git-ink); }

/* ── closer ────────────────────────────────────────────────────────────── */
.git-closer { padding: clamp(80px,14vw,160px) var(--git-pad) clamp(60px,10vw,110px); text-align: center; }
.git-closer h2 { font-size: clamp(34px,7.5vw,90px); line-height: 1.02; max-width: 20ch; margin: 0 auto; }
.git-closer__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 32px; }
.git-closer__legal { margin-top: 32px; font-family: var(--git-ff-m); font-size: 11.5px; color: var(--git-dim); }

/* ── cart drawer (device 6) ───────────────────────────────────────────── */
.git-cart { position: fixed; inset: 0; z-index: 150; pointer-events: none; }
.git-cart[aria-hidden="false"] { pointer-events: auto; }
.git-cart__scrim { position: absolute; inset: 0; width: 100%; height: 100%; background: rgba(8,6,3,.7); opacity: 0; transition: opacity .5s var(--git-ease); backdrop-filter: blur(2px); cursor: default; }
.git-cart[aria-hidden="false"] .git-cart__scrim { opacity: 1; }
.git-cart__panel {
  position: absolute; top: 0; right: 0; height: 100%; width: min(94vw,420px); background: var(--git-bg);
  border-left: 1px solid var(--git-line); display: flex; flex-direction: column;
  transform: translateX(101%); transition: transform .55s var(--git-ease); font-family: var(--git-ff-m);
}
.git-cart[aria-hidden="false"] .git-cart__panel { transform: none; }
.git-cart__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 20px; border-bottom: 1px solid var(--git-line); }
.git-cart__title { font-family: var(--git-ff-d); font-size: 26px; letter-spacing: .01em; }
.git-cart__title span { color: var(--git-accent); font-size: .55em; margin-left: 4px; }
.git-cart__x { display: grid; place-items: center; width: 40px; height: 40px; color: var(--git-dim); }
.git-cart__x:hover { color: var(--git-ink); }
.git-cart__items { flex: 1; overflow-y: auto; padding: 6px 20px; }
.git-cart__empty { padding: 40px 0; color: var(--git-dim); font-size: 12.5px; text-transform: uppercase; letter-spacing: .04em; line-height: 1.9; }
.git-cart__it { display: grid; grid-template-columns: 60px 1fr auto; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--git-line); align-items: start; }
.git-cart__im { aspect-ratio: 4/5; background: var(--git-plate); overflow: hidden; border-radius: 2px; }
.git-cart__im img { width: 100%; height: 100%; object-fit: contain; padding: 6%; }
.git-cart__n { font-size: 11px; text-transform: uppercase; letter-spacing: .02em; line-height: 1.4; }
.git-cart__qty { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
.git-cart__qty button { width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid var(--git-line); border-radius: 999px; color: var(--git-ink); }
.git-cart__qty button:hover { border-color: var(--git-accent); color: var(--git-accent); }
.git-cart__qty span { font-size: 12px; min-width: 14px; text-align: center; }
.git-cart__right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.git-cart__p { font-size: 11.5px; color: var(--git-accent); white-space: nowrap; }
.git-cart__rm { font-size: 10.5px; color: var(--git-dim); text-transform: uppercase; letter-spacing: .04em; min-height: 30px; }
.git-cart__rm:hover { color: var(--git-ink); }
.git-cart__foot { padding: 18px 20px 22px; border-top: 1px solid var(--git-line); }
.git-cart__sum { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
.git-cart__sumlabel { font-size: 12px; color: var(--git-dim); text-transform: uppercase; letter-spacing: .06em; }
.git-cart__total { font-family: var(--git-ff-d); font-size: 26px; }
.git-cart__note { color: var(--git-dim); font-size: 11px; line-height: 1.6; margin-bottom: 14px; }
.git-cart__go { width: 100%; min-height: 50px; background: var(--git-accent); color: var(--git-bg); font-size: 12.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-radius: 999px; transition: .3s var(--git-ease); }
.git-cart__go:hover { background: var(--git-ink); }
.git-cart__go:disabled { opacity: .35; cursor: default; background: var(--git-faint); color: var(--git-dim); }

/* ── reveal (craft rule 4) ────────────────────────────────────────────── */
.git-root [data-rv] { opacity: 0; transform: translateY(20px); transition: opacity .85s var(--git-ease), transform .85s var(--git-ease); }
.git-root [data-rv].git-in { opacity: 1; transform: none; }

/* ── responsive ───────────────────────────────────────────────────────── */
@media (min-width: 860px) {
  .git-nav__mid { display: flex; }
}
@media (max-width: 720px) {
  .git-hero__tiles { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(6, 1fr); }
  .git-heritage__grid, .git-guide__grid, .git-services__grid, .git-visit__grid { grid-template-columns: 1fr; }
  .git-visit__card { align-self: stretch; }
}
@media (max-width: 480px) {
  .git-hero__word { font-size: clamp(44px, 17vw, 90px); }
}

/* ── reduced motion: plain, fully-rendered page ──────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .git-root * { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .git-root [data-rv] { opacity: 1; transform: none; }
  .git-marq__t { animation: none; }
  .git-prod { animation: none; opacity: 1; }
  .git-prod__im img, .git-pan__i img, .git-hero__tile img { filter: grayscale(0) !important; }
}
`
