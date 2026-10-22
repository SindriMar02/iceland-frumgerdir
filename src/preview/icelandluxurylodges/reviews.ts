/* ── Guest reviews, in the SNDR review-sync standard shape ──────────────────
   On the live site this is `src/content/reviews.json`, and `_tools/review-sync`
   rewrites it every Monday 07:30 from the Airbnb door (listing 1918233 is
   Álftavík: "Hosted by Signy · Superhost", 4.95 from 184 reviews, read
   2026-09-02 on the listing itself). The prototype keeps it as a module so the
   page can import it without a JSON loader; the shape is identical.
   Vrbo is read by hand (no free door) and says so in `read`. Quotes are one
   sentence each, cut verbatim at a sentence boundary, never paraphrased. */
export const REVIEW_DATA = {
  sources: [
    { platform: 'Airbnb', listing: '1918233', house: 'Álftavík', url: 'https://www.airbnb.com/rooms/1918233', count: 184, rating: 4.95, of: 5, read: '2026-09-02', synced: 'weekly' },
    { platform: 'Vrbo', listing: '', house: 'Úlfljótsskáli', url: '', count: 28, rating: 10, of: 10, read: '2026-08-16', synced: 'by hand' },
  ],
  reviews: [
    { id: 'vrbo:ulfljotsskali:shawn-r', platform: 'Vrbo', house: 'Úlfljótsskáli', author: 'Shawn R.', date: '2024-11', rating: 5, text: 'We were able to see the Northern Lights from the hot tub.' },
    { id: 'vrbo:ulfljotsskali:carrie-s', platform: 'Vrbo', house: 'Úlfljótsskáli', author: 'Carrie S.', date: '2025-05', rating: 5, text: 'This was the perfect place to bring our family to celebrate our wedding.' },
    { id: 'vrbo:ulfljotsskali:patricia-p', platform: 'Vrbo', house: 'Úlfljótsskáli', author: 'Patricia P.', date: '2026-03', rating: 5, text: 'Our stay at this property was absolutely incredible — the house itself is simply beyond nice.' },
    { id: 'vrbo:ulfljotsskali:blair-b', platform: 'Vrbo', house: 'Úlfljótsskáli', author: 'Blair B.', date: '2025-01', rating: 5, text: 'The common areas are extremely well designed for a large gathering, with everything you need provided.' },
    { id: 'vrbo:alftavik:joshua-s', platform: 'Vrbo', house: 'Álftavík', author: 'Joshua S.', date: '2025-07', rating: 5, text: 'Amazing stay at a wonderful property.' },
  ],
} as const

export const MONTH_NAME = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
