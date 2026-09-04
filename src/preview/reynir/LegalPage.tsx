/**
 * Reynir bakarí — persónuverndarstefna og skilmálar (privacy + order terms).
 *
 * This page exists because the order form collects personal data: a name, a
 * phone number, an email address, sometimes a delivery address, and for company
 * orders a KENNITALA. Publishing that form without telling people what happens
 * to it is not a missing nicety, it is a breach of persónuverndarlög nr. 90/2018
 * (Iceland's GDPR implementation).
 *
 * ⚠️ THIS IS A DRAFT FOR THEIR ACCOUNTANT OR LAWYER TO APPROVE. It describes
 * accurately what this website actually does, which is the hard part and the
 * part only we can write. But two things below are marked as needing the
 * owner's decision (retention period, deposit policy) and no one should sign
 * off wording about a real company's obligations except that company.
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Chrome from './Chrome'
import { HOME_PATH } from './paths'
import { setThemeColor } from '../../lib/preview'
import { LOGO } from './data'
import { useLang } from './useLang'
import { SiteContentProvider, useSiteContent } from './sanity'
import { BODY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, HAIR_SOFT, INK_DEEP, IVORY } from './tokens'


const CSS = `
  /* Safari 26 tints its chrome from body's background-color (theme-color is
     ignored since Liquid Glass) — without this the status-bar strip is WHITE
     on this ink-dark page. See [[ios-safe-area-chrome-color]]. */
  html, body { background-color:${INK_DEEP}; }
  .rb-lg ::selection { background:#5C1C1F; color:${IVORY}; }
  .rb-lg a:focus-visible, .rb-lg button:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; border-radius:4px; }
  .rb-lg-bar { display:flex; align-items:center; justify-content:space-between; gap:20px;
    padding:calc(18px + env(safe-area-inset-top, 0px)) clamp(20px,4.5vw,72px) 18px; border-bottom:1px solid ${HAIR_SOFT}; }
  .rb-lg-back { display:inline-flex; align-items:center; gap:8px; text-decoration:none;
    font-family:${BODY}; font-size:14px; color:${DIM}; padding:11px 0; transition:color .2s ${EASE}; }
  .rb-lg-back:hover { color:${GOLD_LIGHT}; }
  .rb-lg-lang { background:none; border:none; cursor:pointer; padding:14px 13px; margin:-14px -13px;
    font-family:${BODY}; font-size:13px; letter-spacing:.08em; color:${FAINT}; transition:color .2s ${EASE}; border-radius:4px; }
  .rb-lg-lang[aria-pressed="true"] { color:${GOLD_LIGHT}; }
  .rb-lg-wrap { max-width:760px; margin:0 auto; padding:clamp(48px,8vh,88px) clamp(20px,4.5vw,72px) clamp(72px,10vh,120px); }
  .rb-lg-wrap h2 { font-family:${DISPLAY}; font-weight:400; font-size:clamp(26px,3.2vw,38px); line-height:1.15;
    margin:clamp(40px,6vh,60px) 0 0; }
  .rb-lg-wrap h3 { font-family:${DISPLAY}; font-weight:400; font-size:clamp(19px,2vw,23px); color:${IVORY};
    margin:clamp(26px,3.5vh,34px) 0 0; }
  .rb-lg-wrap p, .rb-lg-wrap li { font-size:15.5px; line-height:1.75; color:${DIM}; margin:12px 0 0; }
  .rb-lg-wrap ul { margin:12px 0 0; padding-left:20px; }
  .rb-lg-wrap li { margin:6px 0 0; }
  .rb-lg-wrap a { color:${GOLD_LIGHT}; text-decoration:underline; text-underline-offset:3px; }
  .rb-lg-meta { font-size:13px; color:${FAINT}; margin-top:10px; }
  .rb-lg-note { margin-top:clamp(30px,4vh,40px); padding:16px 18px; border:1px solid ${HAIR};
    border-radius:4px; background:rgba(243,234,211,.03); }
  .rb-lg-note p { font-size:14px; margin:0; }
`

type Block = { h?: string; p?: string[]; ul?: string[] }

const IS_DOC: { title: string; updated: string; blocks: Block[] } = {
  title: 'Persónuvernd og skilmálar',
  updated: 'Uppfært 16. ágúst 2026',
  blocks: [
    { h: 'Ábyrgðaraðili', p: ['Reynir bakari ehf., kt. 701195-3029, Dalvegi 4, 201 Kópavogi. Sími 564 4700, netfang reynirbakari@reynirbakari.is.'] },
    {
      h: 'Hvaða upplýsingum við söfnum',
      p: ['Þegar þú sendir pöntunarbeiðni í gegnum vefinn biðjum við um eftirfarandi:'],
      ul: [
        'Nafn og símanúmer, svo við getum staðfest pöntunina.',
        'Netfang, valfrjálst, svo hægt sé að ná í þig ef ekki svarast í síma.',
        'Það sem þú pantaðir: vöru, valmöguleika, fjölda, afhendingardag og athugasemdir.',
        'Fyrir fyrirtækjapantanir: nafn fyrirtækis, kennitölu og tengilið, svo hægt sé að gefa út reikning.',
        'Afhendingarstað, ef óskað er eftir sendingu í stað þess að sækja.',
        'Mynd, ef þú velur að senda mynd með pöntun, til dæmis mynd sem á að fara á tertu eða mynd sem við eigum að vinna út frá. Myndin fylgir pöntunarbeiðninni sem viðhengi í tölvupósti. Vefurinn geymir hana ekki og hún er hvergi vistuð á netinu.',
      ],
      },
    {
      h: 'Af hverju og á hvaða grundvelli',
      p: [
        'Við notum upplýsingarnar eingöngu til að vinna úr pöntuninni þinni: staðfesta hana, baka rétta vöru á réttum degi, gefa út reikning þegar við á, og hafa samband ef eitthvað þarf að ræða.',
        'Vinnslan byggir á samningi við þig (framkvæmd samnings, sbr. 2. tölul. 9. gr. laga nr. 90/2018), og að því er varðar reikninga á lagaskyldu um bókhald.',
        'Við sendum þér ekki markpóst og seljum eða miðlum upplýsingunum ekki til þriðja aðila í markaðsskyni.',
      ],
    },
    {
      h: 'Hverjir sjá upplýsingarnar',
      p: [
        'Pöntunarbeiðnin berst í netfangið pantanir@reynirbakari.is og er aðgengileg starfsfólki sem vinnur við pantanir. Vefurinn sjálfur geymir engar pantanir.',
        'Vinnsluaðilar sem koma að rekstri vefsins (hýsingaraðili og efnisveita) kunna að vinna gögnin fyrir okkar hönd samkvæmt vinnslusamningi.',
      ],
    },
    {
      h: 'Hversu lengi',
      p: [
        'Pöntunarbeiðnir eru geymdar á meðan verið er að afgreiða pöntunina og í hæfilegan tíma eftir það vegna fyrirspurna. Bókhaldsgögn, þar á meðal reikningar á kennitölu, eru geymd í sjö ár eins og bókhaldslög kveða á um.',
      ],
    },
    {
      h: 'Réttindi þín',
      p: ['Þú átt rétt á að fá aðgang að þeim upplýsingum sem við geymum um þig, láta leiðrétta þær, láta eyða þeim þegar það á við, og andmæla vinnslu. Hafðu samband í reynirbakari@reynirbakari.is.'],
      ul: ['Teljir þú að vinnslan standist ekki lög getur þú beint kvörtun til Persónuverndar, persónuvernd.is.'],
    },
    {
      h: 'Vefkökur',
      p: [
        'Vefurinn notar engar vefkökur til að rekja þig. Valið þitt á tungumáli er geymt í vafranum þínum svo síðan muni það milli heimsókna; þær upplýsingar fara hvergi.',
        'Við teljum heimsóknir með Cloudflare Web Analytics. Sú talning notar engar vefkökur, geymir enga persónugreinanlega vitneskju um þig og fylgir þér ekki milli vefsvæða. Við sjáum aðeins samtölur: hversu margir komu, hvaða síður voru skoðaðar og í hvaða landi. Þess vegna biðjum við þig ekki um samþykki fyrir vefkökum.',
        'Tvennt annað hleðst inn frá öðrum: kortið á forsíðunni er frá Google, og letrið á vefnum kemur af leturþjónustu Google. Í báðum tilvikum sér Google IP-tölu þína, eins og hver annar vefþjónn sem vafrinn þinn sækir skrá til. Hvorugt setur vefköku.',
      ],
    },
    { h: 'Skilmálar sérpantana' },
    {
      h: 'Pöntun og staðfesting',
      p: [
        'Beiðni sem send er í gegnum vefinn er ekki bindandi pöntun fyrr en við höfum staðfest hana. Við hringjum til að fara yfir útfærslu og endanlegt verð.',
        'Verð sem birtist á vefnum er áætlað verð miðað við það sem valið var. Endanlegt verð er staðfest í símtalinu.',
      ],
    },
    {
      h: 'Fyrirvari og afhending',
      p: ['Lágmarksfyrirvari er tilgreindur við hverja vöru. Í kringum hátíðir getur fyrirvarinn verið lengri og þá látum við vita þegar við staðfestum.'],
    },
    {
      h: 'Greiðsla',
      p: ['Ekkert er greitt á netinu. Greitt er þegar pöntunin er sótt á Dalvegi 4, eða samkvæmt reikningi þegar um fyrirtækjapöntun er að ræða.'],
    },
    {
      h: 'Breytingar og afpantanir',
      p: ['Hafðu samband í síma 564 4700 eins fljótt og hægt er. Vörur sem þegar eru komnar í framleiðslu getur þurft að greiða fyrir.'],
    },
    {
      h: 'Ofnæmi',
      p: ['Allt er bakað í sama húsi og því getum við ekki ábyrgst að vara sé alveg laus við ofnæmisvalda á borð við hnetur, glúten, egg eða mjólk. Láttu vita í pöntuninni og við segjum þér hvað er mögulegt.'],
    },
  ],
}

const EN_DOC: { title: string; updated: string; blocks: Block[] } = {
  title: 'Privacy and terms',
  updated: 'Updated 16 August 2026',
  blocks: [
    { h: 'Who is responsible', p: ['Reynir bakari ehf., reg. no. 701195-3029, Dalvegur 4, 201 Kópavogur, Iceland. Phone +354 564 4700, email reynirbakari@reynirbakari.is.'] },
    {
      h: 'What we collect',
      p: ['When you send an order request through this website we ask for:'],
      ul: [
        'Your name and phone number, so we can confirm the order.',
        'Your email address, optional, so we can reach you if the phone goes unanswered.',
        'What you ordered: the product, the options, the quantity, the collection date and any notes.',
        'For company orders: the company name, its kennitala and a contact person, so an invoice can be issued.',
        'A delivery address, if you ask us to deliver rather than collect.',
        'A photo, if you choose to send one with an order, for example a picture to go on a cake or one for us to work from. It travels with the order request as an email attachment. The website does not store it and it is not held anywhere online.',
      ],
    },
    {
      h: 'Why, and on what basis',
      p: [
        'We use it only to handle your order: to confirm it, bake the right thing on the right day, invoice it where relevant, and reach you if something needs discussing.',
        'The legal basis is performance of a contract with you (Icelandic Act 90/2018, implementing the GDPR), and for invoices, our statutory bookkeeping obligations.',
        'We do not send marketing, and we do not sell or share your details with third parties for marketing.',
      ],
    },
    {
      h: 'Who sees it',
      p: [
        'Order requests arrive at pantanir@reynirbakari.is and are seen by the staff who handle orders. The website itself stores no orders.',
        'Processors involved in running the site (our host and content service) may process the data on our behalf under a processing agreement.',
      ],
    },
    {
      h: 'How long we keep it',
      p: [
        'Order requests are kept while the order is being handled and for a reasonable period afterwards in case of questions. Accounting records, including invoices issued to a kennitala, are kept for seven years as Icelandic bookkeeping law requires.',
      ],
    },
    {
      h: 'Your rights',
      p: ['You may ask for a copy of what we hold about you, have it corrected, have it deleted where that applies, and object to processing. Write to reynirbakari@reynirbakari.is.'],
      ul: ['If you believe the processing is unlawful you may complain to Persónuvernd, the Icelandic Data Protection Authority, at personuvernd.is.'],
    },
    {
      h: 'Cookies',
      p: [
        'This site sets no tracking cookies. Your language choice is stored in your own browser so the page remembers it between visits; that never leaves your device.',
        'We count visits with Cloudflare Web Analytics. It uses no cookies, stores nothing that identifies you, and does not follow you between sites. We see totals only: how many people came, which pages they read, and which country they were in. That is why we do not ask you to accept cookies.',
        'Two things load from someone else: the map on the front page is served by Google, and the typefaces are served by Google Fonts. In both cases Google sees your IP address, as any server your browser fetches a file from does. Neither sets a cookie.',
      ],
    },
    { h: 'Custom order terms' },
    {
      h: 'Ordering and confirmation',
      p: [
        'A request sent through this website is not a binding order until we have confirmed it. We phone you to go through the details and the final price.',
        'The price shown on the website is an estimate based on what you selected. The final price is confirmed on that call.',
      ],
    },
    {
      h: 'Notice and collection',
      p: ['The minimum notice is stated on each product. Around holidays it can be longer, and we will tell you when we confirm.'],
    },
    {
      h: 'Payment',
      p: ['Nothing is charged online. You pay when you collect at Dalvegur 4, or by invoice for company orders.'],
    },
    {
      h: 'Changes and cancellations',
      p: ['Call 564 4700 as early as you can. Items already in production may still have to be paid for.'],
    },
    {
      h: 'Allergies',
      p: ['Everything is baked in the same building, so we cannot guarantee that any item is entirely free of allergens such as nuts, gluten, egg or milk. Tell us in the order and we will say what is possible.'],
    },
  ],
}

function LegalInner() {
  const [lang, setLang] = useLang()
  const { LINKS } = useSiteContent()
  const doc = lang === 'is' ? IS_DOC : EN_DOC

  useEffect(() => {
    setThemeColor(INK_DEEP)
  }, [])

  return (
    <div className="rb-lg" lang={lang} style={{ fontFamily: BODY, color: IVORY, background: INK_DEEP, minHeight: '100svh', overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="rb-lg-bar">
        <Link to={HOME_PATH} aria-label={lang === 'is' ? 'Til baka á vefinn' : 'Back to the bakery'}>
          <img src={LOGO} alt="Reynir bakarí" width={124} height={54} decoding="async" style={{ width: 124, height: 'auto', display: 'block' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Link to={HOME_PATH} className="rb-lg-back">
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
              <path d="M5.5 1L1 5.5L5.5 10M1 5.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {lang === 'is' ? 'Til baka á vefinn' : 'Back to the bakery'}
          </Link>
          <div role="group" aria-label="Language" style={{ display: 'flex', gap: 2 }}>
            <button className="rb-lg-lang" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
            <span aria-hidden="true" style={{ color: FAINT, alignSelf: 'center' }}>/</span>
            <button className="rb-lg-lang" aria-pressed={lang === 'is'} onClick={() => setLang('is')}>ÍS</button>
          </div>
        </div>
      </header>

      <main className="rb-lg-wrap">
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.05, margin: 0, ...GOLD_TEXT }}>{doc.title}</h1>
        <p className="rb-lg-meta">{doc.updated}</p>

        {doc.blocks.map((b, i) => (
          <section key={i}>
            {b.h && (i === 0 || !b.p ? <h2 style={{ ...GOLD_TEXT }}>{b.h}</h2> : <h3>{b.h}</h3>)}
            {b.p?.map((t, j) => <p key={j}>{t}</p>)}
            {b.ul && <ul>{b.ul.map((t, j) => <li key={j}>{t}</li>)}</ul>}
          </section>
        ))}

        <div className="rb-lg-note">
          <p>
            {lang === 'is'
              ? 'Spurningar um persónuvernd eða pöntun? Hringdu í '
              : 'Questions about privacy or an order? Call '}
            <a href={`tel:${LINKS.phone}`}>{LINKS.phoneLabel}</a>
            {lang === 'is' ? ' eða sendu okkur línu á ' : ' or write to '}
            <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>.
          </p>
        </div>
      </main>

      <Chrome />
    </div>
  )
}

export default function ReynirLegalPage() {
  return (
    <SiteContentProvider>
      <LegalInner />
    </SiteContentProvider>
  )
}
