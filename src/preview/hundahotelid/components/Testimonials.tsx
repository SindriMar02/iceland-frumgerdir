import { Star } from 'lucide-react'
import type { Testimonial } from '../data'

/**
 * THE TESTIMONIALS — device 6, restyled from the vendored 21st.dev base
 * (uilayout.contact/testimonial-basic, id 18913): kept its editorial
 * bordered alternating-row structure and name-band + star-row anatomy,
 * dropped the Tailwind theme tokens for this page's own namespaced CSS
 * (hh-testi*), dropped the video-thumbnail treatment (this page has real
 * facility photography doing that job elsewhere), and replaced the stock
 * avatar photos with paw-monogram circles — no fake faces, since no photo
 * of any of these three reviewers was harvested.
 */
function PawMonogram({ letter }: { letter: string }) {
  return (
    <div className="hh-testi__avatar" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full opacity-25">
        <circle cx="20" cy="24" r="8" fill="currentColor" />
        <circle cx="9" cy="14" r="4" fill="currentColor" />
        <circle cx="19" cy="8" r="4.4" fill="currentColor" />
        <circle cx="30" cy="13" r="4" fill="currentColor" />
      </svg>
      <span className="relative">{letter}</span>
    </div>
  )
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div>
      {items.map((t, i) => (
        <div key={t.name} className="hh-testi">
          <div className={`hh-testi__row ${i % 2 === 1 ? 'hh-testi__row--rev' : ''}`}>
            <div className="hh-testi__name">
              <PawMonogram letter={t.name.charAt(0)} />
              <div>
                <p className="text-[17px] leading-tight font-semibold text-[var(--hh-ink)]">{t.name}</p>
                <p className="mt-1 text-[12.5px] text-[var(--hh-muted)]">{t.meta}</p>
              </div>
            </div>
            <div className="hh-testi__quote">
              <p lang="en" className="hh-italic text-[19px] leading-relaxed sm:text-[21px]">
                “{t.quote}”
              </p>
              <div className="hh-testi__stars" aria-label={`${t.rating} af 5 stjörnum`}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-[var(--hh-rust)] stroke-[var(--hh-rust)]" strokeWidth={1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
