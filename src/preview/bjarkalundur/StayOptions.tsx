import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { House } from 'lucide-react'
import { useState } from 'react'
import { Drawing } from './Additions'
import { prices, soldOut } from './availability'
import { ROOMS, IMG, matchesRoomFilter, fitsParty } from './data'
import { Title, refreshSoon } from './shell'
import { useSite } from './site'

export function StayOptions({ start, end, selected, onSelect }: {
  start: Date | null
  end: Date | null
  selected: string | null
  onSelect: (room: string) => void
}) {
  const { t, lang, stay } = useSite()
  const [filter, setFilter] = useState('allt')
  const reduced = useReducedMotion()
  const party = stay.adults + stay.children
  return (
    <div className="stay-options">
      <Title text={t.picker.title} />
      <div className="filters" role="group" aria-label={t.ui.filterAria}>
        {t.roomsPage.filters.map((f) => (
          <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => { setFilter(f.id); refreshSoon() }}>
            {f.label}
          </button>
        ))}
      </div>
      {(['hotel', 'sumarhus'] as const).map((group) => (
        <div key={group} className="option-group">
          <h3 className="t-h3">{t.roomsPage.groups[group]}</h3>
          {/* the discount holds for every cottage, so it is said once, not on each card */}
          {group === 'sumarhus' && <p className="option-discount">{t.cottageDiscount}</p>}
          <div className="option-grid">
            <AnimatePresence initial={false}>
              {ROOMS.filter((r) => r.group === group && matchesRoomFilter(r, filter)).map((r) => {
                const c = t.rooms[r.id]
                const photo = r.pics[0] ? IMG[r.pics[0]] : null
                const full = soldOut(r.id, start, end)
                const fits = fitsParty(r, stay.adults, stay.children)
                const reason = !fits ? (party > r.maxGuests ? t.picker.tooSmall(party) : t.picker.partyMismatch) : full ? t.picker.soldOut : ''
                const price = prices?.currency === 'ISK' ? prices.rooms[r.id]?.from : null
                return (
                  <motion.article
                    key={r.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: reduced ? 0 : 0.45 }}
                    className="option-shell rv-settle"
                  >
                    <button type="button" className="stay-option" disabled={!!reason} aria-pressed={selected === r.id} onClick={() => onSelect(r.id)}>
                      {photo ? (
                        <span className="option-image">
                          <img className="option-photo" src={photo.srcS ?? photo.src} width={400} height={300} alt={photo.alt[lang]} loading="lazy" decoding="async" />
                        </span>
                      ) : (
                        <span className="option-placeholder"><House size={28} strokeWidth={1.3} aria-hidden="true" />{t.ui.photoComing}</span>
                      )}
                      <span className="option-copy">
                        <strong className="t-h3">{c.name}</strong>
                        <span>{r.size} m² · {t.roomsPage.labels.guests}: {c.guests}</span>
                        <span>{t.roomsPage.labels.beds}: {c.beds}</span>
                        <span>{t.roomsPage.labels.bath}: {c.bath}</span>
                        <span>{t.picker.kitchen}: {r.kitchen ? t.picker.yes : t.picker.no}</span>
                        {r.noPower && <span>{t.noPower}</span>}
                        {typeof price === 'number' && Number.isFinite(price) && price > 0 && <strong>{t.picker.from(String(price).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'is' ? '.' : ','))}</strong>}
                        <span className="option-status">{reason || (selected === r.id ? t.picker.selected : t.picker.select)}</span>
                      </span>
                    </button>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
      <article className="upcoming-option" aria-label={t.upcoming.status}>
        <Drawing name="cottage-sketch" caption={t.upcoming.caption} />
        <div>
          <h3 className="t-h3">{t.upcoming.status}</h3>
          <p>{t.upcoming.text}</p>
          <p>{t.upcoming.facts.slice(1).join(' · ')}</p>
        </div>
      </article>
    </div>
  )
}
