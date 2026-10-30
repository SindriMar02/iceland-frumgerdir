import { Bath, Bike, Fish, Flag, House, Mountain, Ruler, Sailboat, Trees, Users, Utensils, Waves } from 'lucide-react'
import { IMG, VEIDIKORTID } from './data'
import { Photo, Title } from './shell'
import { useSite } from './site'

const COTTAGE_ICONS = [House, Ruler, Users, Utensils, Bath, Trees]
const ACTIVITY_ICONS = [Fish, Sailboat, Flag, Bike, Mountain, Waves]
const ACTIVITY_PHOTOS = ['lake', 'kayaks', null, null, 'valley', null] as const
const BASE = `${import.meta.env.BASE_URL}bjarkalundur/v4/`

export function Drawing({ name, caption, showCaption = true }: { name: string; caption: string; showCaption?: boolean }) {
  return (
    <figure className="drawing">
      <picture className="rv-draw">
        <source media="(max-width: 1024px)" srcSet={`${BASE}${name}-s.webp`} />
        <img src={`${BASE}${name}.webp`} alt={caption} width={2048} height={name.startsWith('cottage') ? 1374 : 1529} loading="lazy" decoding="async" />
      </picture>
      {showCaption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export function UpcomingCottages({ compact = false }: { compact?: boolean }) {
  const { t } = useSite()
  return (
    <section className={`upcoming${compact ? ' compact' : ''}`} data-anchor="upcoming" aria-label={t.upcoming.status}>
      <div className={compact ? 'new-cottage-grid' : 'wrap new-cottage-grid'}>
        <div className="new-cottage-copy">
          <Title text={t.upcoming.title} stagger={!compact} />
          <p className="body rv-up">{t.upcoming.text}</p>
          <ul className="new-facts rv-stagger">
            {t.upcoming.facts.map((fact, i) => {
              const Icon = COTTAGE_ICONS[i]
              return <li key={fact}><Icon size={23} strokeWidth={1.3} aria-hidden="true" />{fact}</li>
            })}
          </ul>
        </div>
        <div className="new-cottage-drawings">
          {/* one caption for the pair: it sits under the last drawing shown */}
          <Drawing name="cottage-sketch" caption={t.upcoming.caption} showCaption={compact} />
          {!compact && <Drawing name="cottage-elevation" caption={t.upcoming.caption} />}
        </div>
      </div>
    </section>
  )
}

export function Activities() {
  const { t } = useSite()
  return (
    <section className="activities" data-anchor="activities" aria-labelledby="bj-activities">
      <div className="wrap">
        <Title id="bj-activities" text={t.activities.title} stagger />
        <ul className="activity-icons rv-icons">
          {t.activities.items.map((item, i) => {
            const Icon = ACTIVITY_ICONS[i]
            return <li key={item.name}><Icon size={28} strokeWidth={1.3} aria-hidden="true" /><span>{item.name}</span></li>
          })}
        </ul>
        <div className="activity-grid rv-stagger">
          {t.activities.items.map((item, i) => {
            const photo = ACTIVITY_PHOTOS[i]
            const Icon = ACTIVITY_ICONS[i]
            const drawing = i === 2 ? 'minigolf-sketch' : i === 3 ? 'ebike-sketch' : null
            return (
              <article key={item.name} className="activity-card">
                {photo && <Photo pic={IMG[photo]} sizes="(max-width: 899px) 92vw, 30vw" ratio="3 / 2" className="rv-settle" />}
                {drawing && <Drawing name={drawing} caption={`${t.activities.drawing}: ${item.name}`} />}
                {i === 5 && <div className="activity-symbol"><Icon size={64} strokeWidth={1.3} aria-hidden="true" /></div>}
                <h3 className="t-h3">{item.name}</h3>
                <p className="rv-up">{item.text}</p>
                {i === 0 && <a className="tlink" href={VEIDIKORTID}>{t.faq.fishingLink}</a>}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
