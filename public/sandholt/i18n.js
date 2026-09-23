/* ══════════════════════════════════════════════════════════════
   SANDHOLT — ÍS / EN.

   Icelandic is the page as written; English lives in the table below,
   keyed by the Icelandic it replaces. Every translatable node keeps its
   Icelandic original, so switching back is exact, never a round trip.
   An element can carry data-en to override the table where one Icelandic
   word needs two different English ones (Matseðill is "Menu", except in
   the phone menu panel, where it sits under a burger already labelled
   "Menu" and reads "Food & Drink").

   Runs before app.js: it sets the starting language before app.js splits
   headings into words, and it exposes SH_I18N.t() for the live status
   strings app.js writes. On a switch it swaps the text inside one view
   transition, then hands back to app.js (__shRelang) to re-split and
   re-measure. The choice rides in ?lang=en and in localStorage.

   Facts: the history lines follow Minjastofnun's listing of Laugavegur 36
   (company founded 1920, shop at Laugavegur 42 and baking on Frakkastígur
   until the house was built in 1925, protected 19 May 2011, stone oven
   still in use). Menu names, descriptions and prices follow sandholt.is.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var EN = {
    /* head */
    'Sandholt Bakarí · Laugavegur 36, Reykjavík · Síðan 1920': 'Sandholt Bakery · Laugavegur 36, Reykjavík · Since 1920',
    'Sandholt er handverksbakarí á Laugavegi 36 í Reykjavík, stofnað 1920. Fjórða kynslóð bakarameistara stendur nú við ofninn. Súrdeigsbrauð, kaffi, morgunmatur og veislutertur. Opið alla daga 07:30–18:00.':
      'Sandholt is an artisan bakery at Laugavegur 36 in Reykjavík, founded in 1920 and now run by the fourth generation of master bakers. Sourdough bread, coffee, breakfast and celebration cakes. Open every day 07:30–18:00.',
    'Sandholt Bakarí · Síðan 1920': 'Sandholt Bakery · Since 1920',
    'Handverksbakarí á Laugavegi 36. Fjórða kynslóð bakarameistara. Opið alla daga 07:30–18:00.':
      'Artisan bakery at Laugavegur 36, Reykjavík. The fourth generation of master bakers. Open every day 07:30–18:00.',
    'is_IS': 'en_GB',

    /* chrome */
    'Beint í efni': 'Skip to content',
    'Aðalvalmynd': 'Main menu',
    'Valmynd': 'Menu',
    'Sandholt, heim': 'Sandholt, home',
    'Dagurinn': 'The Day',
    'Sagan': 'Our Story',
    'Matseðill': 'Menu',
    'Veislur': 'Celebrations',
    'Heimsókn': 'Visit',
    'Alla daga 07:30–18:00': 'Every day 07:30–18:00',

    /* hero + live status (the status strings come from app.js) */
    'Handverksbakarí stofnað 1920, á Laugavegi 36 síðan 1925.<br class="hero__br">Fjórða kynslóð bakarameistara við sama ofn.':
      'An artisan bakery founded in 1920, at Laugavegur 36 since 1925.<br class="hero__br">Now the fourth generation of master bakers at the same oven.',
    'Opið': 'Open',
    'Lokað': 'Closed',
    'til 18:00': 'until 18:00',
    'opnum 07:30': 'opens at 07:30',
    'Við lokum kl. 18:00': 'We close at 18:00',
    'Við opnum kl. 07:30': 'We open at 07:30',

    /* the day */
    'Dagurinn í Sandholti': 'A day at Sandholt',
    'Klukkan fjögur er súrdeigið vakið.': 'At four in the morning, the sourdough wakes up.',
    'Deigið': 'The dough',
    'Súrdeigið er tekið úr kæli. Húsið er dimmt og enginn annar mættur.': 'The sourdough comes out of the cold. The house is dark and nobody else is in yet.',
    'Morgunmatur': 'Breakfast',
    'Við opnum. Skyr, chia, vöfflur og ristað súrdeigsbrauð. Kaffivélin er komin í gang.': 'The doors open. Skyr, chia, waffles and toasted sourdough. The coffee machine is already running.',
    'Hádegi': 'Lunch',
    'Súpa dagsins, ferskt súrdeigspasta og hamborgari með steiktu smælki.': 'Soup of the day, fresh sourdough pasta and a burger with pan-fried baby potatoes.',
    'Síðdegi': 'Afternoon',
    'Kaffi og kaka. Rólegasti tíminn í húsinu og sá besti til að sitja lengi.': 'Coffee and cake. The quietest time in the house, and the best one for lingering.',
    'Við lokum. Súrdeigið fer aftur í kæli og bíður morguns.': 'The doors close. The sourdough goes back into the cold to wait for morning.',

    /* the story */
    'Fjórar kynslóðir': 'Four generations',
    '<span class="nw">Sama fjölskylda.</span> <span class="nw">Sama handverk.</span> <em>Hundrað og sex ár.</em>': '<span class="nw">One family.</span> <span class="nw">One craft.</span> <em>A hundred and six years.</em>',
    'Bakarameistararnir Stefán Sandholt og Guðmundur Ólafsson stofnuðu bakaríið 4. apríl 1920. Fyrstu árin var búðin á Laugavegi 42 og bakað á Frakkastíg. Árið 1925 reistu þeir húsið á Laugavegi 36, með bakaríið á jarðhæð og heimili beggja fjölskyldna á hæðunum fyrir ofan.':
      'Master bakers Stefán Sandholt and Guðmundur Ólafsson founded the bakery on 4 April 1920. In the early years the shop was at Laugavegur 42 and the baking was done on Frakkastígur. In 1925 they built the house at Laugavegur 36, with the bakery on the ground floor and both families living on the floors above.',
    'Í dag stendur Ásgeir Sandholt við sama ofn, fjórði bakarameistarinn í beinan legg. Faðir hans, afi og langafi unnu allir í þessu húsi.':
      'Today Ásgeir Sandholt works the same oven, the fourth master baker in a direct line. His father, grandfather and great-grandfather all worked in this house.',
    'Stefán Sandholt og Guðmundur Ólafsson stofna bakaríið': 'Stefán Sandholt and Guðmundur Ólafsson found the bakery',
    'Húsið á Laugavegi 36 rís og baksturinn flyst þangað': 'The house at Laugavegur 36 is built and the baking moves in',
    'Húsið er friðlýst og steinofninn enn í notkun': 'The house is listed, its stone oven still in use',
    '4.&nbsp;kynslóð': '4th&nbsp;generation',
    'Ásgeir Sandholt, bakarameistari': 'Ásgeir Sandholt, master baker',

    /* sourdough */
    'Súrdeigið': 'The sourdough',
    'Ekkert pressuger. Bara tími.': 'No baker’s yeast. Just time.',
    'Súrdeigsbrauðin okkar lyfta sér á villtu geri og langri, kaldri hefun. Engar flýtileiðir og engin aukefni. Þess vegna er skorpan dökk og bragðið sýrt.':
      'Our sourdough loaves rise on wild yeast and a long, cold proof. No shortcuts and no additives. That is why the crust is dark and the flavour has its tang.',
    'Sama deig gengur í gegnum allan seðilinn: ristaða brauðið á morgnana, ferska pastað í hádeginu, brauðið sem fylgir súpunni.':
      'The same dough runs through the whole menu: the toast in the morning, the fresh pasta at lunch, the bread that comes with the soup.',
    '18&nbsp;klst': '18&nbsp;hours',
    'köld hefun': 'cold proof',
    'hráefni í brauðinu': 'ingredients in the bread',
    'aukefni': 'additives',

    /* menu */
    'Á borðum akkúrat núna': 'Serving right now',
    'Seðillinn fylgir deginum. Það sem er í boði <b>núna</b> er merkt, en ekkert er falið.': 'The menu follows the day. What is being served <b>now</b> is marked, and nothing is hidden.',
    'Morgunmatur <span class="mgroup__t">frá kl. 07:30</span>': 'Breakfast <span class="mgroup__t">from 07:30</span>',
    'Hádegisseðill <span class="mgroup__t">frá kl. 12:00</span>': 'Lunch <span class="mgroup__t">from 12:00</span>',
    'Samlokur <span class="mgroup__t">allan daginn</span>': 'Sandwiches <span class="mgroup__t">all day</span>',
    'Kaffi <span class="mgroup__t">frá kl. 07:30</span>': 'Coffee <span class="mgroup__t">from 07:30</span>',
    'Heitt og kalt <span class="mgroup__t">allan daginn</span>': 'Hot and cold drinks <span class="mgroup__t">all day</span>',
    'Í glasi <span class="mgroup__t">frá kl. 12:00</span>': 'By the glass <span class="mgroup__t">from 12:00</span>',

    'Með sítrónurjóma, berjum og granóla': 'With lemon cream, berries and granola',
    'Chia grautur': 'Chia pudding',
    'Með mangókompotti og granóla': 'With mango compote and granola',
    'Ristað súrdeigsbrauð': 'Toasted sourdough',
    'Borið fram með sultu og smjöri': 'Served with jam and butter',
    'Vaffla með berjum': 'Waffle with berries',
    'Nýbökuð vaffla, ber, jarðarberjasósa og þeyttur rjómi': 'Freshly made waffle, berries, strawberry sauce and whipped cream',
    'Vaffla með beikoni': 'Waffle with bacon',
    'Brúnaðar pekanhnetur og brandí-karamellusósa': 'Toasted pecans and brandy caramel sauce',
    'Soðnir tómatar, egg, súrdeigsbrauð og ítölsk pylsa': 'Stewed tomatoes, eggs, sourdough and Italian sausage',
    'Vegan shakshuka': 'Vegan shakshuka',
    'Súrdeigsbrauð, tómatar, kjúklingabaunir og spínat': 'Sourdough, tomatoes, chickpeas and spinach',
    'Spælegg': 'Fried eggs',
    'Chimichurri, súrdeigsbrauð, pylsa eða beikon': 'Chimichurri and sourdough, with sausage or bacon',
    'Laxa- og avókadóbrauð': 'Salmon and avocado toast',
    'Reyktur lax, steikt egg, súrsaður laukur, sinnepskrem': 'Smoked salmon, fried egg, pickled onion, mustard cream',
    'Vegan avókadóbrauð': 'Vegan avocado toast',
    'Avókadómauk og tómata-chimichurri': 'Crushed avocado and tomato chimichurri',
    'Lambasteikarsamloka': 'Roast lamb sandwich',
    'Hægeldaður lambabógur, súrsað hvítkál, kóríanderkrem': 'Slow-cooked lamb shoulder, pickled cabbage, coriander cream',

    'Súpa dagsins': 'Soup of the day',
    'Borin fram með súrdeigsbrauði og smjöri': 'Served with sourdough and butter',
    'Ferskt súrdeigspasta dagsins': 'Fresh sourdough pasta of the day',
    'Borið fram með súrdeigsbrauði og smjöri': 'Served with sourdough and butter',
    'Hamborgari með steiktu smælki': 'Burger with pan-fried baby potatoes',
    'Nautakjöt 140 g, reyktur ostur, heimalöguð tómatsósa': '140 g beef, smoked cheese, homemade ketchup',
    'Vegan borgari með steiktu smælki': 'Vegan burger with pan-fried baby potatoes',
    'Buff úr sætum kartöflum, byggi og gulrótum': 'A patty of sweet potato, barley and carrot',

    'Kjúklingasalatloka': 'Chicken salad baguette',
    'Grillaður kjúklingur, romesco og majónes': 'Grilled chicken, romesco and mayonnaise',
    'Laxasamloka': 'Salmon sandwich',
    'Reyktur lax, rjómaostur, súrsuð agúrka, dill': 'Smoked salmon, cream cheese, pickled cucumber, dill',
    'Tómat- og mozzarellasamloka': 'Tomato and mozzarella sandwich',
    'Pestó, balsamik og salat': 'Pesto, balsamic and salad leaves',
    'Vegan samloka': 'Vegan sandwich',
    'Eggaldinmauk, bygg- og grænmetisbuff, klettasalat': 'Aubergine purée, barley and vegetable patty, rocket',

    'Tvöfaldur espresso': 'Double espresso',
    'Kaffi': 'Coffee',
    'Soja eða hafra': 'Soy or oat milk',
    'Heitt súkkulaði': 'Hot chocolate',
    'Heitt súkkulaði með Stroh': 'Hot chocolate with Stroh rum',
    'Te': 'Tea',
    'Teko íslenskt te': 'Teko Icelandic tea',
    'Sódavatn': 'Sparkling water',
    'Mjólk eða kókómjólk': 'Milk or chocolate milk',
    'Appelsínu- eða eplasafi': 'Orange or apple juice',
    'Límonaði': 'Lemonade',
    'Mímósa': 'Mimosa',
    'Bjór á krana': 'Draught beer',
    'Lífrænt rauðvín eða hvítvín': 'Organic red or white wine',
    'Kampavín': 'Champagne',
    'Öll verð eru í íslenskum krónum. Hefur þú fæðuofnæmi eða fæðuóþol? Hafðu samband og við förum yfir innihaldið með þér.':
      'All prices are in Icelandic krónur. Do you have a food allergy or intolerance? Get in touch and we’ll go through the ingredients with you.',

    /* celebrations */
    'Bakað fyrir tilefnið.': 'Baked for the occasion.',
    'Við bökum kransakökur, brúðartertur, skírnartertur og veislubrauð eftir pöntun, margt eftir gömlum uppskriftum bakarísins.':
      'We bake kransakaka ring cakes, wedding cakes, christening cakes and party breads to order, many of them from the bakery’s old recipes.',
    'Pantanir þurfa að berast með fyrirvara. Segðu okkur tilefnið, fjöldann og dagsetninguna og við sjáum um afganginn.':
      'Please order in good time. Tell us the occasion, the number of guests and the date, and we’ll take care of the rest.',
    'Senda fyrirspurn': 'Send an enquiry',
    'mailto:sandholt@sandholt.is?subject=Fyrirspurn%20um%20veislutertu': 'mailto:sandholt@sandholt.is?subject=Celebration%20cake%20enquiry',

    /* the house */
    'Húsið': 'The house',
    'Sama hús og sami steinofn síðan 1925. Hér er pláss til að sitja lengi og engum liggur á.':
      'The same house and the same stone oven since 1925. There’s room to sit for a while here, and nobody’s in a hurry.',

    /* visit */
    'Kíktu við í kaffi og brauð.': 'Drop in for coffee and bread.',
    'Heimilisfang': 'Address',
    'Opnunartími': 'Opening hours',
    'Alla daga<br>07:30–18:00': 'Every day<br>07:30–18:00',
    'Sími': 'Phone',
    'Netfang': 'Email',
    'Sjá á korti': 'View on map',
    'Staðan núna': 'Right now',
    'að íslenskum tíma': 'Iceland time',

    /* footer */
    'Handverksbakarí síðan 1920 · Laugavegur 36 · Fjórða kynslóð bakarameistara': 'Artisan bakery since 1920 · Laugavegur 36 · The fourth generation of master bakers',

    /* image descriptions */
    'Súrdeigsbrauð með dökkri skorpu': 'Sourdough loaf with a dark crust',
    'Súrdeigsbrauð með dökkri, sprunginni skorpu': 'Sourdough loaf with a dark, crackled crust',
    'Nýbakaðar kringlur á bökunarplötu': 'Freshly baked kringla buns on a baking tray',
    'Bakaðir bitar á tréfjöl': 'Baked pieces on a wooden board',
    'Bakari leggur lokahönd á eftirrétt': 'A baker putting the finishing touches to a dessert',
    'Gestur við borð inni í Sandholti': 'A guest at a table inside Sandholt',
    'Bakari heldur á nýlagaðri köku á diski': 'A baker holding a freshly made cake on a plate',
    'Kransakaka skreytt jarðarberjum og blómum': 'Kransakaka ring cake decorated with strawberries and flowers',
    'Bjart rými með borðum og stólum': 'A bright room with tables and chairs',
    'Barista lagar kaffi á espressóvél': 'A barista making coffee on the espresso machine',
    'Nýbakaðir kanilsnúðar': 'Freshly baked cinnamon rolls'
  };

  /* Leaf elements whose content is copy. Anything absent from EN (names,
     prices, the address, "Espresso") stays as written in both languages. */
  var TEXT = [
    '.skip', '.nav__set a', '.burger__lab', '.ovl__set a span', '.ovl__foot p',
    '.hero__who', '.eyebrow', '.h2', '.day__n', '.day__d', '.lede',
    '.gens b', '.gens span', '.scrub', '.facts b', '.facts span',
    '.menu__note', '.mgroup__h', '.mi__n', '.mi__d', '.menu__foot',
    '.btn span', '.visit__dl dt', '.visit__dl dd', '.shell__lab', '.shell__clock i',
    '.foot__line'
  ].join(',');
  var ATTRS = [['img[alt]', 'alt'], ['[aria-label]', 'aria-label'], ['a[href^="mailto:"]', 'href'],
               ['meta[name="description"],meta[property^="og:"]', 'content']];

  var html = document.documentElement;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  // capture every Icelandic original before app.js splits anything
  var texts = $$(TEXT).map(function (el) {
    var is = el.innerHTML, key = norm(is);
    return { el: el, is: is, en: el.getAttribute('data-en') || EN[key] };
  });
  var attrs = [];
  ATTRS.forEach(function (pair) {
    $$(pair[0]).forEach(function (el) {
      var v = el.getAttribute(pair[1]);
      if (v && EN[v] != null) attrs.push({ el: el, name: pair[1], is: v, en: EN[v] });
    });
  });
  var titleIs = document.title;

  var lang = 'is';

  function apply(next) {
    lang = next;
    var en = next === 'en';
    html.lang = next;
    document.title = en && EN[titleIs] ? EN[titleIs] : titleIs;
    texts.forEach(function (t) { if (t.en != null) t.el.innerHTML = en ? t.en : t.is; });
    attrs.forEach(function (a) { a.el.setAttribute(a.name, en ? a.en : a.is); });
    $$('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === next));
    });
    placeBars();
  }

  /* The hairline under the live language. It is a fixed 100px line scaled
     to the label, so moving it is a transform, never a layout. The label's
     trailing letter-spacing is trimmed so the line ends with the glyph.  */
  function placeBars() {
    $$('.lang').forEach(function (g) {
      var bar = g.querySelector('.lang__bar');
      var on = g.querySelector('[aria-pressed="true"] span');
      if (!bar || !on || !on.offsetWidth) return;
      var ls = parseFloat(getComputedStyle(on).letterSpacing) || 0;
      var x = on.offsetLeft;                       // the group is the offsetParent
      g.style.setProperty('--bx', x.toFixed(1) + 'px');
      g.style.setProperty('--bs', ((on.offsetWidth - ls) / 100).toFixed(4));
      if (!g.classList.contains('is-set')) {
        void g.offsetWidth;                        // first placement lands without sliding
        g.classList.add('is-set');
      }
    });
  }

  function remember(next) {
    try { localStorage.setItem('sh-lang', next); } catch (e) {}
    try {
      var u = new URL(location.href);
      if (next === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    } catch (e) {}
  }

  /* One crossfade of the whole page, 340ms, while the headings in view rise
     again word by word in the new language. The two toggles are lifted out
     of the snapshot so their hairline slides live instead of fading. No
     View Transitions (or reduced motion): the text simply changes.        */
  function setLang(next) {
    if (next === lang) return;
    remember(next);
    var run = function () {
      apply(next);
      if (window.__shRelang) window.__shRelang();
    };
    if (!REDUCED && document.startViewTransition) document.startViewTransition(run);
    else run();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-set-lang]');
    if (b) setLang(b.getAttribute('data-set-lang'));
  });

  // a group that was hidden (the menu panel) gets its hairline when it appears
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function () { placeBars(); });
    $$('.lang').forEach(function (g) { ro.observe(g); });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeBars);

  // starting language: ?lang= wins, then the visitor's last choice, then Icelandic
  var start = 'is';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    var saved = localStorage.getItem('sh-lang');
    start = q === 'en' || q === 'is' ? q : saved === 'en' ? 'en' : 'is';
  } catch (e) {}
  if (start === 'en') apply('en'); else placeBars();

  window.SH_I18N = {
    t: function (s) { return lang === 'en' && EN[s] != null ? EN[s] : s; },
    get lang() { return lang; },
    // for audits: Icelandic copy on the page with no English
    missing: function () {
      return texts.filter(function (t) { return t.en == null && /[áéíóúýþæöð]/i.test(t.el.textContent); })
                  .map(function (t) { return norm(t.is); });
    }
  };
})();
