/**
 * Pólar Hestar — the full text of each short tour, for its own page
 * (/preview/polarhestar/reidtur/:id), plus the search titles and descriptions.
 *
 * Why these pages exist: the owners were told (17 Oct 2026) that the short
 * tours are hard to find on Google. On polarhestar.is each short tour has a
 * page, but its title is only the brand name ("Grýtubakki Charm | Pólarhestar"),
 * there is no description, no structured data and no Icelandic page. Nobody
 * searches for "Grýtubakki Charm"; they search for "horse riding Akureyri".
 * So every page here says what the tour is and where it is, in all three
 * languages, and the standalone build prerenders it with these titles.
 *
 * EN and DE are the owners' own text from polarhestar.is (fetched 17 Oct 2026),
 * word for word except four spelling fixes, flagged in _docs/POLARHESTAR-2026-10-17.md:
 * "brake" → "break", "entlag" → "entlang", "Lebenraum" → "Lebensraum",
 * "glizernd" → "glitzernd". Their site has no Icelandic short-tour pages; the
 * Icelandic is our translation of their English.
 */
import type { L3, Lang } from './data'

export const SHORT_TOUR_TEXT: Record<string, L3[]> = {
  'fyrstu-kynni': [
    {
      is: 'Þetta er tilvalin ferð til að kynnast íslenska hestinum í fyrsta sinn. Frá Grýtubakka ríðum við að ánni Gljúfurá, meðfram árbakkanum og upp að fjöllunum, þaðan sem útsýnið yfir Eyjafjörð er fallegt. Heima á bænum bíða heimabakaðar kökur og hressing.',
      en: 'This is the ideal tour for your first experience with the Icelandic horse. From Grýtubakki farmhouse we ride towards the river Gljúfurá, along the riverside and up to the mountains from where we have a beautiful view over the fjord Eyjafjörður. Back on the farm, some homemade cakes and refreshments are expecting you.',
      de: 'Diese Tour ist ideal, um erste Erfahrungen mit dem Islandpferd zu sammeln, aber durchaus auch geeignet für erfahrene Reiter, die auf ihrer Islandreise nur wenig Zeit haben. Von unserem Farmhaus Grýtubakki reiten wir in Richtung des Flusses Gljúfurá und entlang seines tief in die Landschaft eingeschnittenen Flussbettes hoch in die Berge. Dort erwartet uns ein wunderschöner Blick über den Fjord Eyjafjörður. Abgerundet wird der Ritt durch ein gemütliches Kaffeetrinken auf der Farm mit selbst gebackenen Kuchen und heißen Getränken.',
    },
  ],
  'moa-og-mela': [
    {
      is: 'Tveggja tíma reiðtúrinn er vinsælasta ferðin okkar og hentar þeim sem vilja kynnast íslenska hestinum og náttúrunni í kring betur. Eftir veðri, færð og reynslu knapanna ríðum við meðfram Gljúfurá, yfir græn engi og móa, í átt að Eyjafirði eða upp í eyðibyggðina í Fjörðum. Heima á bænum bíða kaffi, te, heitt súkkulaði og heimabakaðar smákökur.',
      en: 'The two hour ride is our most popular riding tour and ideal for those who want to get a more intensive contact with the Icelandic horse and the surrounding nature. Depending on weather and trail conditions as well as the riding experience of the participants, we ride along the river Gljúfurá, over green meadows, through moorland, towards the fjord Eyjafjörður or up to the deserted peninsula of Fjörður. Coffee, tea, hot chocolate and homemade cookies are awaiting you at the farm.',
      de: 'Der Zwei-Stunden-Ritt ist der beliebteste unserer kurzen Ausritte und eignet sich für Anfänger ebenso wie für Reiter mit mehr Erfahrung. Er ist ideal für all diejenigen, die das Islandpferd und seinen ursprünglichen Lebensraum näher kennenlernen möchten.',
    },
    {
      is: '',
      en: '',
      de: 'Je nach Reiterfahrung der Teilnehmer sowie den aktuellen Wetter- und Wegeverhältnissen reiten wir über grüne Wiesen entlang des Flusses Gljúfurá, durch Moorgebiete mit weichem Wollgras, in Richtung des längsten Fjordes Islands, des Eyjafjörður, oder hoch in die verlassene Bergwelt der Halbinsel Fjörður. Zurück auf der Farm erwartet uns der Duft selbst gebackenen Kuchens und heißer Getränke.',
    },
  ],
  hofdahringur: [
    {
      is: 'Í þessari ferð ríðum við fallegan hring í kringum Þengilhöfða. Við ríðum meðfram Gljúfurá í átt að Eyjafirði og landslagið á leiðinni er ótrúlega fjölbreytt. Ef heppnin er með þér sérðu jafnvel hvali, því tær sjórinn í lengsta firði landsins er leikvöllur hnúfubaka, hrefna, hnísa og andarnefja. Fyrir ofan Grenivík tökum við aðeins lengri pásu og njótum útsýnisins út að mynni fjarðarins. Heima bíða girnilegar kökur og hressing.',
      en: 'On this tour, a beautiful ride around the hill Höfði is expecting you. We ride alongside river Gljúfurá, heading towards the fjord Eyjafjörður. You will be amazed by the variety of the breathtaking landscape you are riding through. And if you are lucky you might even spot some whales. The clear water of the longest fjord in Iceland is the playground for humpback whales, minke whales, harbor porpoises and northern bottlenose whales. Above the small fishing village Grenivík we will take a little bit longer break so you can enjoy the amazing view to the entrance of the fjord. Back home delicious cakes and refreshments complete this intensive contact with the Icelandic horse and nature.',
      de: 'Auf dieser Tour erwartet Sie ein herrlicher Ritt rund um den Hügel Höfði. Entlang des Flusses Gljúfurá machen wir uns auf den Weg in Richtung des Fjordes Eyjafjörður, der unser steter Begleiter auf diesem Ritt sein wird. Am Fuß des Hügels Höfði bildet der längste Fjord Islands eine atemberaubende Kulisse und ist zugleich Lebensraum verschiedener Walarten, darunter Buckelwale, Zwergwale, Schweinswale und Nördliche Entenwale. Mit etwas Glück können wir diesen beeindruckenden Meeresbewohnern bei ihrem Spiel im klaren Wasser des Fjordes zuschauen.',
    },
    {
      is: '',
      en: '',
      de: 'Oberhalb des kleinen Fischerdörfchens Grenivík legen wir eine etwas längere Pause ein, um den wunderschönen Ausblick auf den Eingang des Fjordes zu genießen, bevor wir uns entlang der Rückseite des Hügels wieder auf den Heimweg zur Farm Grýtubakki begeben. Dort werden wir von selbst gebackenem Kuchen und heißen Getränken erwartet.',
    },
  ],
  frostrosir: [
    {
      is: 'Á veturna er landið oftast þakið þykkum snjó og norðanvindurinn lætur finna fyrir sér. Vel klædd í kuldagalla, ullarvettlinga og ennisband ríðum við í átt að Eyjafirði og öndum að okkur köldu vetrarloftinu. Sérstök birta vetrarsólarinnar gefur ferðinni dulúðugan blæ og gerir hana ógleymanlega. Heima á bænum hlýja heimabakaðar kökur og heitir drykkir.',
      en: 'During wintertime the Icelandic landscape is usually covered by a thick layer of snow and the northern wind is challenging you. Warmly packed in an overall, woolen gloves and a headband you will enjoy the ride towards the fjord Eyjafjörður, breathing the cold air of Icelandic winter. The special light of the winter sun gives this ride a mystic atmosphere and makes this tour an unforgettable experience. Back on the farm, homemade cakes and hot drinks will warm you up again.',
      de: 'Während der Wintermonate ist die nordisländische Landschaft zumeist in eine dicke Schneedecke gehüllt und der arktische Wind spielt ausgelassen mit der langen, flauschigen Wintermähne unserer Pferde. Warm eingepackt in einen Overall genießen Sie den Ritt in Richtung des wunderschönen Fjordes Eyjafjörður. Die tief stehende Wintersonne taucht die glitzernde weiße Landschaft in ein blau-rotes Licht und verleiht diesem Ritt eine ganz besondere, mystische Note. Zurück auf der Farm wärmt Sie ein gemütliches Kaffeetrinken mit selbst gebackenem Kuchen und heißen Getränken wieder auf.',
    },
  ],
  sumarsaela: [
    {
      is: 'Í þessari samsettu ferð kynnist þú íslenskri náttúru bæði á hestbaki og á mínígolfvellinum okkar. Hver af sex heimasmíðuðu brautunum vísar í umhverfi bæjarins eða íslenska náttúru.',
      en: 'This combo tour provides the ideal opportunity to get to know the Icelandic nature not only on horseback but also based on our Minigolf course. Each one of the six self-made lanes represents a part of the surroundings of our farm or the Icelandic nature.',
      de: 'Diese Kombitour bietet eine ideale Möglichkeit, die isländische Natur nicht nur vom Rücken des Pferdes aus zu erkunden, sondern zugleich auch spielerisch anhand unserer hofeigenen Minigolfanlage kennenzulernen. Denn jede unserer sechs selbstgebauten Minigolfbahnen hat einen Bezug zur näheren Umgebung unseres Hofes oder zur Natur Islands.',
    },
    {
      is: 'Í einn og hálfan tíma ríðum við yfir græn engi meðfram Gljúfurá og fylgjum henni upp að fjöllunum, þaðan sem útsýnið yfir Eyjafjörð og nágrennið er frábært. Heima bíða heimabakaðar kökur og heitir drykkir, og svo býður litli mínígolfvöllurinn í trjánum fyrir ofan bæinn upp á keppni við samferðafólkið. Alls tekur ferðin um tvo og hálfan tíma.',
      en: 'On the one and a half hour ride we ride over green meadows along the river Gljúfurá and follow its course up to the mountains. From there we have a fantastic view over the fjord Eyjafjörður and our surroundings. Homemade cakes and hot drinks await you back on the farm. Subsequently, our little minigolf course, which is located in the trees above our farm, invites you to participate in a minigolf tournament with your fellow riders. All in all, you can expect a duration of about two and a half hours for this combo tour.',
      de: 'Auf dem anderthalbstündigen Ritt reiten wir über grüne Wiesen entlang des Flusses Gljúfurá und folgen seinem Lauf ein Stück hinauf in die Berge, von wo aus wir einen fantastischen Ausblick über den Fjord Eyjafjörður und unsere Umgebung haben. Zurück auf der Farm werden wir von selbst gebackenem Kuchen und heißen Getränken erwartet. Im Anschluss lädt unsere versteckt zwischen den Bäumen oberhalb unserer Farm liegende Minigolfanlage zu einem spannenden Duell mit Ihren Mitreitern ein. Alles in allem können Sie für diese Kombitour eine Dauer von etwa zweieinhalb Stunden einplanen.',
    },
  ],
}

/** The notes under every short tour on their site. EN theirs; IS ours; DE theirs
 *  for the first, ours for the second (their German pages leave it out). */
export const SHORT_TOUR_NOTES: L3[] = [
  {
    is: 'Af öryggisástæðum ákveðum við leiðina dag frá degi, eftir lengd ferðarinnar, reynslu knapanna, veðri og færð.',
    en: 'For safety reasons, we decide on the exact route of the tour on a daily basis, taking into consideration different, varying factors such as the ride duration, riding experience of the participants and weather and trail conditions.',
    de: 'Zu Ihrer eigenen Sicherheit und um Ihnen stets das bestmögliche Reiterlebnis zu bieten, passen wir den genauen Tourenverlauf den aktuellen Gegebenheiten an. Dabei spielen verschiedene Faktoren wie die Reiterfahrung der Teilnehmer, die Wetterverhältnisse und der Zustand der Wege eine Rolle.',
  },
  {
    is: 'Ef þú forfallast eða seinkar með stuttum fyrirvara, hringdu þá í okkur.',
    en: 'Cancellations or delays with short notice: Please phone!',
    de: 'Bei kurzfristiger Absage oder Verspätung rufen Sie uns bitte an.',
  },
]

/** What the tour is, in search words. Ours, per language. */
const KIND: Record<string, L3> = {
  'fyrstu-kynni': { is: 'klukkutíma hestaferð', en: '1-hour horse riding tour', de: '1 Stunde Reiten auf Islandpferden' },
  'moa-og-mela': { is: 'tveggja tíma hestaferð', en: '2-hour horse riding tour', de: '2 Stunden Reiten auf Islandpferden' },
  hofdahringur: { is: 'þriggja tíma hestaferð', en: '3-hour horse riding tour', de: '3 Stunden Reiten auf Islandpferden' },
  frostrosir: { is: 'vetrarhestaferð', en: 'winter horse riding tour', de: 'Winterritt auf Islandpferden' },
  sumarsaela: { is: 'hestaferð og mínígolf', en: 'horse riding and minigolf', de: 'Reiten und Minigolf' },
}

export const kindOf = (id: string, lang: Lang) => KIND[id]?.[lang] ?? { is: 'hestaferð', en: 'horse riding tour', de: 'Ausritt' }[lang]

/** The same, shorter, for when the title has to fit. */
const KIND_SHORT: Record<string, L3> = {
  'fyrstu-kynni': { is: '1 klst. hestaferð', en: '1-hour ride', de: '1-Std.-Ausritt' },
  'moa-og-mela': { is: '2 klst. hestaferð', en: '2-hour ride', de: '2-Std.-Ausritt' },
  hofdahringur: { is: '3 klst. hestaferð', en: '3-hour ride', de: '3-Std.-Ausritt' },
  frostrosir: { is: 'vetrarhestaferð', en: 'winter ride', de: 'Winterritt' },
  sumarsaela: { is: 'hestaferð og mínígolf', en: 'ride and minigolf', de: 'Ritt und Minigolf' },
}

/** What sets this ride apart, from the owners' own text for it (SHORT_TOUR_TEXT), so five descriptions are five. */
const HIGHLIGHT: Record<string, L3> = {
  'fyrstu-kynni': { is: 'Meðfram Gljúfurá upp að fjallsrótum.', en: 'Along the river Gljúfurá up to the mountains.', de: 'Entlang der Gljúfurá hinauf in die Berge.' },
  'moa-og-mela': { is: 'Yfir græn engi og móa að Eyjafirði.', en: 'Over green meadows and moors towards the fjord.', de: 'Über Wiesen und Moore Richtung Fjord.' },
  hofdahringur: { is: 'Hringur um Þengilhöfða, jafnvel hvalir í firðinum.', en: 'A loop around the hill Höfði, maybe with whales.', de: 'Rund um den Hügel Höfði, mit Glück Wale im Fjord.' },
  frostrosir: { is: 'Vetrarreið í snjó, í hlýjum kuldagalla.', en: 'A winter ride through the snow, warmly dressed.', de: 'Winterritt durch den Schnee, warm eingepackt.' },
  sumarsaela: { is: 'Reiðtúr, mínígolf og heimabakaðar kökur.', en: 'A ride, minigolf and homemade cake.', de: 'Ritt, Minigolf und selbst gebackener Kuchen.' },
}

/** First candidate that fits `max` characters; the last one when none does. */
const fit = (max: number, ...candidates: string[]) => candidates.find((c) => c.length <= max) ?? candidates[candidates.length - 1]

/**
 * <title> for a short-tour page: brand name first (it is theirs and what
 * returning guests type), then what and where (what new guests type).
 * "30 minutes from Akureyri" is their own fact (long-tour pickup text).
 * Kept within about 60 characters, which is what a result shows: the longest
 * form that fits wins, dropping the brand suffix (the result shows the site
 * name anyway) and then shortening the description of the ride.
 */
export function shortTourTitle(id: string, name: string, lang: Lang): string {
  const where = { is: 'nálægt Akureyri', en: 'near Akureyri', de: 'bei Akureyri' }[lang]
  const kind = kindOf(id, lang)
  const short = KIND_SHORT[id]?.[lang] ?? kind
  return fit(
    60,
    `${name}: ${kind} ${where} | Pólar Hestar`,
    `${name}: ${kind} ${where}`,
    `${name}: ${short} ${where}`,
    `${name}: ${short} | Pólar Hestar`,
    `${name}: ${short}`,
  )
}

/** <meta name="description">, from the tour's own facts, within the 160 characters a result shows. */
export function shortTourDescription(
  t: { id: string; minAge: number; price: number },
  childPrice: number,
  lang: Lang,
): string {
  const n = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.')
  const kind = kindOf(t.id, lang)
  const up = `${kind[0].toUpperCase()}${kind.slice(1)}`
  const hi = HIGHLIGHT[t.id]?.[lang] ?? ''
  if (lang === 'is')
    return fit(
      160,
      `${up} frá Grýtubakka við Eyjafjörð, 30 mín. frá Akureyri. ${hi} Frá ${t.minAge} ára. ${n(t.price)} kr. á mann, börn ${n(childPrice)} kr.`,
      `${up} frá Grýtubakka, 30 mín. frá Akureyri. ${hi} Frá ${t.minAge} ára. ${n(t.price)} kr., börn ${n(childPrice)} kr.`,
      `${up} frá Grýtubakka, 30 mín. frá Akureyri. ${hi} Frá ${t.minAge} ára. ${n(t.price)} kr.`,
      `${up} frá Grýtubakka, 30 mín. frá Akureyri. Frá ${t.minAge} ára. ${n(t.price)} kr., börn ${n(childPrice)} kr.`,
    )
  if (lang === 'de')
    return fit(
      160,
      `${kind} vom Hof Grýtubakki am Eyjafjörður, 30 Min. von Akureyri. ${hi} Ab ${t.minAge} Jahren. ${n(t.price)} ISK, Kinder ${n(childPrice)} ISK.`,
      `${kind} vom Hof Grýtubakki, 30 Min. von Akureyri. ${hi} Ab ${t.minAge} J. ${n(t.price)} ISK, Kinder ${n(childPrice)} ISK.`,
      `${kind} ab Grýtubakki, 30 Min. von Akureyri. ${hi} Ab ${t.minAge} J. ${n(t.price)} ISK.`,
      `${kind} ab Grýtubakki, 30 Min. von Akureyri. Ab ${t.minAge} Jahren. ${n(t.price)} ISK, Kinder ${n(childPrice)} ISK.`,
    )
  return fit(
    160,
    `${up} from Grýtubakki farm by Eyjafjörður, 30 min from Akureyri. ${hi} From age ${t.minAge}. ${n(t.price)} ISK per person, children ${n(childPrice)} ISK.`,
    `${up} from Grýtubakki farm, 30 min from Akureyri. ${hi} From age ${t.minAge}. ${n(t.price)} ISK, children ${n(childPrice)} ISK.`,
    `${up} from Grýtubakki, 30 min from Akureyri. ${hi} From age ${t.minAge}. ${n(t.price)} ISK per person.`,
    `${up} from Grýtubakki farm, 30 min from Akureyri. From age ${t.minAge}. ${n(t.price)} ISK, children ${n(childPrice)} ISK.`,
  )
}
