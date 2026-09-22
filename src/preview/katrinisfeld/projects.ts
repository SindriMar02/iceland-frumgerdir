/**
 * Katrín Ísfeld — the work, as she publishes it.
 *
 * Titles are hers, taken verbatim from her own navigation on 2026-08-18, so
 * that anyone searching a project by the name she has used for years still
 * lands on it. Twenty-three projects in four categories; seventeen of them
 * have photography and get a page of their own, six are listed only, because
 * inventing a description for a project we have never seen would be the one
 * kind of mistake that cannot be walked back.
 *
 * Every lead, body, fact and credit below is taken from her own project pages
 * on katrinisfeld.is (read 2026-09-14) and written in her voice. Nothing is
 * read off a photograph: where her page says little, this says little. Client
 * names appear only where she lists them herself; no floor areas, budgets or
 * dates she did not publish.
 */

export type CategorySlug = 'innanhusshonnun' | 'gistiheimili-og-hotel' | 'atvinnuhusnaedi' | 'ymislegt'

export interface Photo {
  /** key into photo-dims.json */
  id: string
  alt: string
  /** object-position where a crop would lose the subject (a portrait photo
      in the landscape project hero), e.g. '50% 66%'. Omit for centre. */
  pos?: string
}

export interface Project {
  slug: string
  /** Her own title. */
  title: string
  category: CategorySlug
  /** One line under the title, and the meta description seed. */
  lead: string
  /** Her own words from katrinisfeld.is, in her voice. Never read off a photograph. */
  body: string[]
  photos: Photo[]
  /** Short factual pairs shown as a definition list. */
  facts?: Array<[string, string]>
  /** Photographer, where she credits one. Her credit, carried verbatim. */
  credit?: string
  /** Old WordPress path, for the 301 map. */
  oldPath: string
}

export const CATEGORIES: Record<CategorySlug, {
  slug: CategorySlug; title: string; nav: string; lead: string; body: string
}> = {
  'innanhusshonnun': {
    slug: 'innanhusshonnun',
    title: 'Innanhússhönnun á heimilum',
    nav: 'Heimili',
    lead: 'Heil hús, einstök rými og allt þar á milli.',
    body:
      'Stærstur hluti verkefnanna eru heimili: nýbyggingar sem teiknaðar eru innan frá og eldri hús sem eru tekin í gegn. Sum verkefni ná yfir húsið allt, önnur eru eitt eldhús, eitt baðherbergi eða eitt fataherbergi. Vinnan er sú sama í báðum tilvikum, umfangið er það sem breytist.',
  },
  'gistiheimili-og-hotel': {
    slug: 'gistiheimili-og-hotel',
    title: 'Hönnun gistiheimila og hótela',
    nav: 'Gistiheimili og hótel',
    lead: 'Rými sem þurfa að þola gesti allt árið og líta samt út fyrir að vera heimili.',
    body:
      'Gistirými eru hönnuð undir öðrum kröfum en heimili. Efnin þurfa að þola þrif og umgengni ókunnugra, herbergin þurfa að vera samræmd svo öll gistingin seljist á sama verði, og myndirnar þurfa að standast samanburð á Booking og Airbnb. Sex verkefni Katrínar eru af þessu tagi, allt frá einstökum íbúðum upp í heilt hótel.',
  },
  'atvinnuhusnaedi': {
    slug: 'atvinnuhusnaedi',
    title: 'Hönnun atvinnuhúsnæðis',
    nav: 'Atvinnuhúsnæði',
    lead: 'Skrifstofur og móttökurými þar sem fyrsta mínútan gestsins ræðst af hönnuninni.',
    body:
      'Í atvinnuhúsnæði er hönnunin hluti af þjónustunni. Móttakan segir til um hvers konar fyrirtæki tekur á móti þér, biðstofan ræður hvort bið líður hratt eða hægt, og starfsfólkið vinnur í rýminu alla daga ársins. Katrín hefur hannað bæði skrifstofurými og heilbrigðisrými, og í báðum tilvikum er verkefnið það sama: að rýmið vinni með því sem fyrirtækið er að reyna að gera, frekar en á móti því. Rýmin eru hönnuð í anda þeirra fyrirtækja sem þar starfa; þarfirnar eru misjafnar en flest hafa haft sömu ósk, að stíllinn sé hlýlegur og skipulagið gott með góðu flæði. Þar sem grafísk hönnun þarf að fylgja, til dæmis merkingar á rúðum, skilrúm og leiðbeinandi merkingar, er hún unnin samhliða rýminu en ekki límd á það eftir á.',
  },
  'ymislegt': {
    slug: 'ymislegt',
    title: 'Ýmislegt',
    nav: 'Ýmislegt',
    lead: 'Umfjöllun og stemningsverkefni.',
    body: 'Verkefni sem falla utan hinna þriggja flokkanna.',
  },
}

const P = (id: string, alt: string): Photo => ({ id, alt })

export const PROJECTS: Project[] = [
  /* ── Innanhússhönnun ─────────────────────────────────────────────────── */
  {
    slug: 'nybyggt-hus-i-suluhofda',
    title: 'Nýbyggt hús í Súluhöfða',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/nybyggt-hus-i-suluhofda/',
    lead: 'Innanhússhönnun í nýbyggingu, þar sem útsýnið fékk að njóta sín í gegnum hönnunarferlið.',
    body: [
      'Húsið var í byggingu þegar ég fékk það verkefni að sjá um innanhússhönnunina. Það er alltaf gleðilegt að fá verkefni á þeim tíma sem enn er hægt að breyta innra skipulaginu, og það var aðeins gert hér.',
      'Lagt var upp með að láta fallega útsýnið frá gólfsíðu gluggunum njóta sín sem best. Eldhúsrýmið er hannað með innréttingum frá Arrital, og á eyjuna varð djúpur vínrauður litur fyrir valinu, á móti mjúkum og dekkri tón í háu innréttingunum. Í baðherbergjunum er sleginn svipaður litatónn, sem tónar vel við hreinlætistækin í mjúkum sandlit.',
      'Allar flísar koma frá Agli Árnasyni. Það kom einstaklega vel út að nota sömu flísar á gólfið í gegnum allt húsið og poppa þær upp með mynstraðri útgáfu í mjúkum lit á arninum og á veggþykkingu inni á baði. Hljóðdúkur er á móti viðarplönkum í breytilegum stærðum meðfram gluggunum í aðalrýminu, og lýsingin er hönnuð með rýminu, þar sem litlir kastarar vinna á móti stærri ljósum sem gefa mýkt og fyllingu.',
    ],
    photos: [
      P('s-eldhus-vitt', 'Eldhús í Súluhöfða með vínrauðri Arrital eyju, koparljósum og útsýni yfir voginn'),
      P('s-eyja', 'Vínrauð eldhúseyja með svörtum blöndunartækjum og koparljósum'),
      P('s-arinn', 'Arinveggur úr ljósum steini með eldiviðarhólfum og faldri lýsingu'),
      P('p-suluhofda-0', 'Arinveggurinn með eldiviðarhólfum og innfelldri lýsingu í múrverkinu'),
      P('s-skapur', 'Innbyggður glerskápur með lýsingu og dökkum viðaráferðum'),
      P('s-fot', 'Fataherbergi með lýstum slám og ljósum innréttingum'),
      P('s-bad', 'Baðherbergi með bogadregnum lýstum spegli og steinvaski'),
      P('s-sturta', 'Sturturými með dökkum steinvegg og grænni plöntu'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun'], ['Gerð', 'Nýbygging'], ['Innréttingar', 'Arrital'], ['Flísar', 'Egill Árnason']],
  },
  {
    slug: 'sumarhus-i-fljotshlidinni',
    title: 'Sumarhús í Fljótshlíðinni',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/sumarhus-fljotshlid/',
    lead: 'Heildarhönnun að innan í sumarhúsi, nýtískulegt, hlýlegt og með góðu flæði.',
    body: [
      'Húsið var í byggingu þegar ég fékk verkefnið, og því gerði ég heildarhönnun á rýminu að innan. Leitað var eftir að hafa rýmið nýtískulegt, hlýlegt og með góðu flæði.',
      'Efnisvalið er gert út frá staðsetningunni og náttúrunni í kring. Litirnir eru mildir og náttúrulegir, viður er í loftinu að hluta á móti hljóðdúk, og fallegir koparlitaðir kastarar eru á móti meira áberandi hangandi ljósum.',
      'Við leyfðum okkur að poppa hönnunina aðeins upp með fallegum litum í veggflísunum á baðherbergjunum. Allar innréttingar eru frá Arrital á Ítalíu.',
    ],
    photos: [
      P('f-stofa', 'Stofa sumarhússins með hörgardínum, hangandi ljósi og leðurstól'),
      P('f-eldhus', 'Eldhús sumarhússins með Arrital innréttingum og mjúku dagsljósi'),
      P('f-eyja', 'Dökk eldhúseyja sumarhússins með blómum'),
      P('f-krokur', 'Borðkrókur með bogalampa og útsýni út í hlíðina'),
      P('f-bitar', 'Borðstofa undir timburbitum með kúpulljósi'),
      P('p-fljotshlid-0', 'Forstofa með terrazzógólfi og hornum á vegg'),
      P('p-fljotshlid-1', 'Svefnherbergi með dökkgrænum vegg og hengiljósi'),
      P('p-fljotshlid-2', 'Sturta með terracotta zellige-flísum á móti terrazzó'),
    ],
    facts: [['Hlutverk', 'Heildarhönnun innanhúss'], ['Gerð', 'Sumarhús'], ['Staðsetning', 'Fljótshlíð'], ['Innréttingar', 'Arrital']],
  },
  {
    slug: 'eldhusrymi-i-skuggahverfi',
    title: 'Eldhúsrými í Skuggahverfi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/eldhusrymi-i-skuggahverfi/',
    lead: 'Lúxus eldhúsrými sem hæfir glæsiíbúð í Skuggahverfinu.',
    body: [
      'Glæsiíbúð í Skuggahverfinu fékk lúxus eldhúsrými sem hæfir íbúðinni. Falleg eik í grábrúnum og hlýjum lit fer vel á móti sandlituðum skápunum sem prýða eyjuna.',
      'Það er keramikplatan, sem minnir á gosösku, sem rammar þetta inn. LED lýsing á bak við fallegu glerskápana flæðir birtu niður keramikplötuna á veggnum og gerir skemmtilega stemningu, og vaskurinn er sérsmíðaður úr keramik og áfastur borðplötunni.',
    ],
    photos: [
      P('p-skuggahverfi-0', 'Eldhús í Skuggahverfi með eik í grábrúnum tón, sandlitaðri eyju og keramikborðplötu'),
      P('p-skuggahverfi-4', 'Lýstir glerskápar með LED-ræmu sem lætur birtuna flæða niður keramikplötuna'),
      P('p-skuggahverfi-1', 'Eldhúseyjan séð frá stofunni, dökk og heil að framan'),
      P('p-skuggahverfi-5', 'Barstólar við eyjuna með mynstruðu áklæði'),
      P('p-skuggahverfi-2', 'Borðplata og barstólar við gólfsíða glugga'),
      P('p-skuggahverfi-3', 'Svart blöndunartæki og undirfelldur vaskur á keramikplötu'),
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Staðsetning', 'Skuggahverfi, Reykjavík']],
  },
  {
    slug: 'eldhusrymi-i-skandinaviskum-stil',
    title: 'Eldhúsrými í skandinavískum stíl',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/eldhusrymi-i-skandinaviskum-stil/',
    lead: 'Ljós eik, sandlitaðir skápar og keramikborðplata með svörtum vaski.',
    body: [
      'Glæsilegt eldhúsrými í fallegum skandinavískum stíl. Ljós eikin fer vel á móti sprautulökkuðum skápunum í ljósum sandlit.',
      'Keramikborðplatan með svarta vaskinum, sem er undirfelldur í plötuna, toppar þetta fallega eldhús. Veggir og loft eru máluð í sama lit og skáparnir.',
    ],
    photos: [
      P('p-skandinaviskt-4', 'Eldhúsrými í skandinavískum stíl með ljósri eik og sandlituðum sprautulökkuðum skápum'),
      P('p-skandinaviskt-1', 'Svartur undirfelldur vaskur í keramikborðplötu undir svörtum vegglampa'),
      P('p-skandinaviskt-0', 'Eldhúseyja með barstólum og eikarhillu'),
      P('p-skandinaviskt-2', 'Háar innréttingar í sandlit með innbyggðum ofni'),
      P('p-skandinaviskt-3', 'Eikarhilla með svörtu hengiljósi og bókum'),
      P('p-skandinaviskt-5', 'Nærmynd af keramikborðplötu og háfi'),
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Stíll', 'Skandinavískur']],
  },
  {
    slug: 'eldhusrymi',
    title: 'Eldhúsrými',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/eldhusrymi/',
    lead: 'Eldhúsið, hjarta heimilisins, hannað út frá þörfum fjölskyldunnar.',
    body: [
      'Stundum er talað um að eldhúsið sé hjarta heimilisins, og þess vegna er oft mikið lagt í þetta rými. Hönnun og útlit hvers eldhúsrýmis endurspeglar þarfir heimilisfólksins og hvernig rýmið umvefur hverja fjölskyldu með persónulegum stíl, fegurð og skipulagi.',
      'Þetta eldhús er í 112 Reykjavík og innréttingin er frá Arrital á Ítalíu.',
    ],
    photos: [
      P('p-eldhusrymi-0', 'Eldhúsrými með grágrænum vegg, ljósum innréttingum og pappírsljósum'),
      P('p-eldhusrymi-1', 'Eldhús með tveimur kúluljósum og barstólum við eyju'),
      P('p-eldhusrymi-2', 'Eldhús í gegnumgangandi rými með stálskáp og gluggum í enda'),
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Staðsetning', '112 Reykjavík'], ['Innréttingar', 'Arrital']],
    credit: 'Hallur Karlsson',
  },
  {
    slug: 'alfheimar',
    title: 'Álfheimar',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/alfheimar/',
    lead: 'Hæð í húsi eftir Sigvalda Thordarson, þar sem stíllinn frá 1970 fékk að halda sér.',
    body: [
      'Hæð í Sigvalda Thordarson húsi var tekin í gegn. Stíllinn frá 1970, þegar húsið var byggt, var látinn koma í gegn með nútímalegu ívafi.',
      'Litir á veggjum og flísar voru valin frá þessum tíma, og haldið var í fallegu tekkhurðirnar og stóra fataskápinn.',
    ],
    photos: [
      P('p-alfheimar-0', 'Stofa á hæð í Sigvalda Thordarson húsi með stóru mósaíkverki og svörtum leðursófa'),
      P('p-alfheimar-6', 'Svefnherbergi með bláum vegg, bólstruðum rúmgafli og upprunalegum tekkfataskáp'),
      P('p-alfheimar-2', 'Gangur með dumbrauðum ísskáp, svörtum ofnum og skógarmynd á vegg'),
      P('p-alfheimar-4', 'Snyrting með korallrauðu lofti, kringlóttum spegli í leðuról og dökkri innréttingu'),
      P('p-alfheimar-5', 'Salerni með grænum flísum frá byggingartímanum og trjábolskolli'),
      P('p-alfheimar-3', 'Rýmisskil úr opinni hillu með veggfóðri og kertastjökum'),
      P('p-alfheimar-1', 'Borðkrókur með hvítu hengiljósi, tímaritahillum og viðarborði'),
      P('p-alfheimar-7', 'Kertastjakar og plöntur við dumbrauðan vegg'),
    ],
    facts: [['Hlutverk', 'Endurhönnun hæðar'], ['Staðsetning', 'Álfheimar, Reykjavík']],
    credit: 'Eggert Jóhannesson',
  },
  {
    slug: 'hus-i-gardabae',
    title: 'Hús í Garðabæ',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/hus-i-gardabae/',
    lead: 'Eldhúsið opnað og látið fljóta saman við stofuna.',
    body: [
      'Þetta verkefni gekk út á að opna eldhúsrýmið og láta það fljóta saman við stofurýmið, og allir veggir í kringum eldhúsið voru teknir burt.',
      'Hljóðdúkur var settur í allt loftið til að koma í veg fyrir hljóðmengun í rýminu, innréttingar og húsgögn voru endurnýjuð og gestasalernið var einnig tekið í gegn.',
    ],
    photos: [
      P('p-gardabaer-0', 'Opið eldhús- og stofurými í Garðabæ eftir að veggirnir kringum eldhúsið voru teknir'),
      P('p-gardabaer-1', 'Eldhúsinnrétting með ljósum skápum og viðaráferð'),
      P('p-gardabaer-2', 'Stofurými með endurnýjuðum húsgögnum og hljóðdúk í lofti'),
      P('p-gardabaer-3', 'Borðstofuhorn við glugga'),
      P('p-gardabaer-4', 'Gestasalerni eftir endurgerð'),
      P('p-gardabaer-5', 'Gangur með innfelldri lýsingu í hljóðdúkslofti'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun'], ['Staðsetning', 'Garðabær']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'badherbergi',
    title: 'Baðherbergi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/badherbergi/',
    lead: 'Sýnishorn úr nokkrum af þeim fjölmörgu baðherbergjum sem ég hef tekið í gegn.',
    body: [
      /* her own words at the 2026-09-22 walkthrough, where she sent these three
         photographs. The house is deliberately unnamed and unlocated: the
         owners allowed this one room and nothing else. */
      'Efstu myndirnar eru úr baðherbergi sem er haldið í einum litatóni. Óskin var samlitt rými, svo ég lét rúðurnar um að brjóta það upp og setti á þær filmu.',
      'Upplifunin í gegnum glerið helst í sama tóninum, en filman poppar hana upp.',
      'Ég hef tekið í gegn fjölmörg baðherbergi, og hér eru sýnishorn úr nokkrum verkefnum.',
      'Meðal þeirra eru baðherbergi á Hávallagötu í 101 Reykjavík, við Lækjarás í 110 Reykjavík, í Baldursgarði í Keflavík og í Álfheimum í 105 Reykjavík.',
    ],
    photos: [
      /* the film first, framed low so the grasses carry the landscape hero */
      { ...P('p-badherbergi-8', 'Baðherbergisgluggi með filmu sem sýnir strá í mjúkum gráum tón'), pos: '50% 66%' },
      P('p-badherbergi-9', 'Filman á glugganum frá öðru sjónarhorni, með ljósum flísum og veggskáp'),
      P('p-badherbergi-10', 'Tvöföld innrétting með tveimur vöskum og baklýstum sporöskjulaga speglum við gluggann með filmunni'),
      P('p-badherbergi-0', 'Baðherbergi á Hávallagötu með kringlóttum spegli, dökkri innréttingu og skálavaski'),
      P('p-badherbergi-1', 'Baðherbergi með opnu sturtusvæði, svörtum blöndunartækjum og innfelldri lýsingu'),
      P('p-badherbergi-4', 'Sturtuklefi með svörtum regnhaus og innfelldri hillu'),
      P('p-badherbergi-5', 'Baðherbergi með kringlóttum spegli, kúluljósi og ljósum flísum'),
      P('p-badherbergi-6', 'Sturtuklefi með glerhurð, handklæðaofni og baðkari'),
      P('p-badherbergi-7', 'Sturtuveggur með svörtum regnhaus og faldri lýsingu við loft'),
      P('p-badherbergi-2', 'Baðherbergi í Árbæ með ljósum flísum og svífandi innréttingu'),
      P('p-badherbergi-3', 'Baðherbergi með svörtum blöndunartækjum og skálavaski á dökkri plötu'),
    ],
    facts: [['Hlutverk', 'Hönnun baðherbergja'], ['Staðsetning', 'Reykjavík og Keflavík']],
  },
  {
    slug: 'barnaherbergi',
    title: 'Barnaherbergi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/barnaherbergi/',
    lead: 'Blágrænn litur á veggjum og lofti, og innréttingar sem heimilisfaðirinn smíðaði.',
    body: [
      'Hér var fallegur blágrænn litur notaður bæði á veggi og loft, og það kemur svo vel út því liturinn er umvefjandi og fallegur.',
      'Innréttingarnar eru einstaklega skemmtilegar og gerðar af heimilisföðurnum.',
    ],
    photos: [
      P('p-barnaherbergi-0', 'Barnaherbergi þar sem blágrænn litur er á bæði veggjum og lofti'),
      P('p-barnaherbergi-1', 'Sérsmíðaðar innréttingar í barnaherbergi, smíðaðar af heimilisföðurnum'),
      P('p-barnaherbergi-2', 'Horn í barnaherbergi með blágrænum vegg'),
      P('p-barnaherbergi-3', 'Rúmhorn í barnaherbergi með umvefjandi lit á lofti'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun barnaherbergis']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'honnunar-studio',
    title: 'Hönnunar Studio',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/honnunar-studio/',
    lead: 'Stúdíóið þar sem innréttingarnar, litirnir og efnin eru til sýnis.',
    body: [
      'Katrín Ísfeld Hönnunar Studio tekur að sér innanhússhönnun heimila, fyrirtækja og gistirýma, bæði hótela og gistiheimila. Stúdíóið flytur einnig inn hágæða ítalskar innréttingar og er með einkaleyfi á innréttingunum frá Arrital, sem fást hér bæði teiknaðar og innfluttar.',
      'Hér starfa innanhússarkitektar og grafískur hönnuður, Ómar Örn Sigurðsson, sem kemur að þeim verkefnum þar sem aðkoma grafísks hönnuðar skiptir máli. Ómar er með yfir 20 ára reynslu í faginu og hefur komið að fjölda verkefna af öllum stærðargráðum.',
      'Í stúdíóinu má sjá hönnun á lýsingu, litum, merkingum á rúðum, speglum, gardínum og listaverkum, og flottu ítölsku innréttingarnar sem eiga stóran sess á gólfinu. Verið velkomin.',
    ],
    photos: [
      P('p-studio-0', 'Framhlið Hönnunar Studio með merkingu í glugga'),
      P('p-studio-1', 'Sýningareldhús frá Arrital í dökkum steini með svartri borðplötu'),
      P('p-studio-2', 'Skúffa opin í Arrital innréttingu með marmaraáferð'),
      P('p-studio-3', 'Lýstur sporöskjulaga spegill á plómurauðum vegg yfir efnisspjöldum'),
      P('p-studio-4', 'Vinnurými undir beinni steypu með sýnilegum lögnum'),
      P('p-studio-5', 'Fundarhorn með plómurauðum vegg og efnissýnum'),
      P('p-studio-7', 'Nærmynd af marmaraáferð á sýningarinnréttingu'),
    ],
    facts: [['Hlutverk', 'Eigið stúdíó og sýningarrými'], ['Staðsetning', 'Reykjavík']],
  },
  {
    slug: 'fjallalind',
    title: 'Fjallalind',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/fjallalind/',
    lead: 'Aðalhæðin tekin í gegn, opnuð í eitt rými og hljóðvistin leyst með hljóðdúk og trérimlum.',
    body: [
      'Aðalhæðin í húsinu var öll tekin í gegn. Stór veggur var tekinn út og eldhúsrýmið opnað inn í stofu og borðstofu, og forstofuveggirnir voru líka teknir, svo forstofan gengur nú inn með ganginum og inn í aðalrýmið.',
      'Til að ná fram góðri hljóðvist var hljóðdúkur settur í allt loftið og hljóðdempandi trérimlar notaðir, og því gátu stórar flísar farið á allt gólfið.',
      'Eldhúsinnréttingin og baðinnréttingin eru frá Arrital, og 12 mm þykkar keramikborðplötur fá að njóta sín bæði í eldhúsi og á baði. Samspil jarðlita og áferða einkennir verkefnið og skapar þægilega og rómantíska stemningu.',
    ],
    photos: [
      P('p-fjallalind-4', 'Opið eldhús- og stofurými í Fjallalind með hljóðdempandi trérimlum og svölum'),
      P('p-fjallalind-3', 'Eldhús í Fjallalind með dökkri steinborðplötu, rimlalofti og plómurauðum vegg'),
      P('p-fjallalind-0', 'Forstofa í Fjallalind með plómurauðum vegg og dökkri hurð'),
      P('p-fjallalind-1', 'Borðkrókur við rimlavegg með hangandi ljósum og barstólum'),
      P('p-fjallalind-2', 'Gangurinn í Fjallalind með listaverki á plómurauðum vegg og leðurstól'),
      P('p-fjallalind-5', 'Setuhorn með okkurlituðum vegg, hillu og leðurstól'),
      P('p-fjallalind-7', 'Baðherbergi með dökkum steini, bogadregnum lýstum spegli og gulu baðkari'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun aðalhæðar'], ['Gerð', 'Endurhönnun'], ['Áhersla', 'Hljóðvist og opið flæði'], ['Innréttingar', 'Arrital']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'fallegt-hus-i-kopavogi',
    title: 'Fallegt hús í Kópavogi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/hus-i-kopavogi/',
    lead: 'Stórkostlega vel hannað hús að utan, tekið allt í gegn að innan.',
    body: [
      'Húsið er stórkostlega vel hannað að utan, en kominn var tími til að taka það allt í gegn að innan, þannig að samhljómur yrði á milli utanhússhönnunarinnar og innanhússins.',
    ],
    photos: [
      P('p-kopavogur-4', 'Eldhús í Kópavogi með ljósri eyju, viðarborðplötu og svörtu rimlalofti'),
      P('p-kopavogur-1', 'Stofa með innbyggðri, lýstri veggeiningu og terracotta vegg'),
      P('p-kopavogur-2', 'Baðherbergi með spanskgrænum flísum, dökkri innréttingu og baðkari'),
      P('p-kopavogur-0', 'Gestasalerni með áferðarmiklum gráum flísum og svífandi innréttingu'),
      P('p-kopavogur-5', 'Hár skápur opinn með kaffihorni og spanskgrænu bakstykki'),
      P('p-kopavogur-7', 'Nærmynd af spanskgrænum vegg og steinborðplötu með viðarbretti'),
      P('p-kopavogur-6', 'Gangur með opnum dyrum inn í baðherbergi og stofu'),
      P('p-kopavogur-3', 'Gangur með ljósu viðargólfi og innfelldri lýsingu'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun'], ['Gerð', 'Endurhönnun'], ['Staðsetning', 'Kópavogur']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'laugalaekur-fataherbergi',
    title: 'Laugalækur, fataherbergi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/laugalaekur/',
    lead: 'Fataherbergi með baðkari í endanum, til að slappa af í friði og ró.',
    body: [
      'Hér var gert fataherbergi með baðkari í endanum, sérstaklega fyrir frúna á heimilinu til að fá að slappa af og vera í friði og ró.',
      'Sérsmíðin á skápum og fatastöngum kom einstaklega vel út.',
    ],
    photos: [
      P('p-laugalaekur-1', 'Fataherbergi á Laugalæk með frístandandi baðkari í endanum og sérsmíðuðum fatastöngum'),
      P('p-laugalaekur-2', 'Sérsmíðaðar fatastangir með skóskúffum undir'),
      P('p-laugalaekur-3', 'Frístandandi baðkar við steinsteypuáferð með kertahillu'),
      P('p-laugalaekur-0', 'Fataherbergið séð fram hjá lýstum vegg með innfelldri gólflýsingu'),
    ],
    facts: [['Hlutverk', 'Hönnun fataherbergis'], ['Gerð', 'Sérsmíði'], ['Staðsetning', 'Laugalækur, Reykjavík']],
  },

  {
    slug: 'sumarhus-i-olfusi',
    title: 'Sumarhús í Ölfusi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/sumarhus-olfusi/',
    lead: 'Stílhrein form og flotuð gólf á móti hlýlegum við og grófum steini.',
    body: [
      'Sumarhús þar sem stíllinn er blanda af stílhreinum formum og flotuðum gólfum með hita í, á móti fallegum og hlýlegum við og grófum steini.',
    ],
    photos: [
      P('p-olfus-0', 'Stofa sumarhúss í Ölfusi með opnu viðarþaki, glergöflum og steinsúlu'),
      P('p-olfus-3', 'Steinklæddur veggur við glugga með gráum vængstól og fuglapúða'),
      P('p-olfus-4', 'Tvö glerkúluljós hangandi fyrir framan steinvegg'),
      P('p-olfus-6', 'Hilla með luktum á móti birkiveggfóðri'),
      P('p-olfus-5', 'Steinveggur mætir glugga yfir flotuðu gólfi'),
      P('p-olfus-1', 'Baðherbergi með gráum flísum og viðarinnréttingu'),
      P('p-olfus-7', 'Eldhúsbar með glerjum í opnum hillum og dökkum viðarinnréttingum'),
      P('p-olfus-2', 'Rennihurð úr furu inn á baðherbergi með bláum vegg'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun'], ['Gerð', 'Sumarhús'], ['Staðsetning', 'Ölfus']],
  },
  {
    slug: 'hus-i-mosfellsbae',
    title: 'Hús í Mosfellsbæ',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/hus-i-mosfellsbae/',
    lead: 'Hús frá 2006 yfirfarið, með betri hljóðvist, nýjum litum og sérteiknuðum innréttingum.',
    body: [
      'Í þessu verkefni var hús sem hannað var árið 2006 yfirfarið. Hljóðvistin var bætt með því að taka loftið niður að hluta yfir eyjunni, með hljóðvist í niðurtekna loftinu.',
      'Allt húsið var málað í flottum litum og innréttingar teiknaðar og hannaðar fyrir svefnganginn, skrifstofuna og sjónvarpsrýmið. Húsgögnum var skipt út fyrir ný og gluggatjöldum komið fyrir, með þessum skemmtilega árangri.',
    ],
    photos: [
      P('p-mosfellsbaer-0', 'Stofa með rauðum eggstól, bláum sófa og steinhlöðnum arni'),
      P('p-mosfellsbaer-1', 'Niðurtekið loft með viðarrimlum og hangandi ljósum yfir eyjunni'),
      P('p-mosfellsbaer-2', 'Sjónvarpsrými með sérteiknaðri innréttingu og bókahillu'),
      P('p-mosfellsbaer-3', 'Lágskápur með dökkri borðplötu og ljósum handföngum'),
    ],
    facts: [['Hlutverk', 'Endurhönnun innanhúss'], ['Staðsetning', 'Mosfellsbær']],
  },
  {
    slug: 'ibud-i-skuggahverfi',
    title: 'Íbúð í Skuggahverfi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/ibud-i-skuggahverfi/',
    lead: 'Íbúð með flottasta útsýnið, hönnuð til að halda léttleika í gegnum rýmið.',
    body: [
      'Íbúð í Skugganum með flottasta útsýnið. Öll hönnunin miðaðist við að halda léttleika í gegnum rýmið, og húsgögnin eru höfð færri en flottari til að skyggja ekki á útsýnið.',
      'Niðurtekna loftið í eldhúsinu kom mjög vel út, þar sem raufin eftir því endilöngu er látin ganga út um endann, og marmaraflísarnar á veggjunum halda í bjarta og flotta léttleikann sem íbúðin hefur.',
    ],
    photos: [
      P('p-ibudskugga-0', 'Útsýni úr íbúðinni yfir sjóinn og Esjuna'),
      P('p-ibudskugga-1', 'Niðurtekið loft í eldhúsinu með rauf sem gengur eftir því endilöngu'),
      P('p-ibudskugga-2', 'Eldhúsveggur klæddur marmaraflísum á móti dökkum innréttingum'),
      P('p-ibudskugga-3', 'Eldhúsið undir niðurtekna loftinu með hangandi ljósi'),
      P('p-ibudskugga-4', 'Borðkrókur með glerborði við gluggana'),
      P('p-ibudskugga-5', 'Setustofa með ljósum gluggatjöldum og dökkum sófa'),
      P('p-ibudskugga-6', 'Gangur með ljósu viðargólfi að gluggavegg'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun íbúðar'], ['Staðsetning', 'Skuggahverfi, Reykjavík']],
  },
  {
    slug: 'arkitektoniskt-kameljon',
    title: 'Arkitektónískt Kameljón',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/kameljon/',
    lead: 'Fallegt eldra hús í Hafnarfirði með viðbyggingu og endurhönnun að innan sem utan.',
    body: [
      'Fallegt eldra hús í Hafnarfirðinum sem hefur fengið viðbyggingu og endurhönnun, bæði að innan og utan.',
      'Einnig var falleg kjallaraíbúð hönnuð í húsinu.',
    ],
    photos: [
      P('p-kameljon-0', 'Svefnherbergi undir súð með dökkum vegg og hvítu panelklæddu lofti'),
      P('p-kameljon-1', 'Barnahorn undir súð með hillum, dúkkuhúsi og eggstól'),
      P('p-kameljon-2', 'Stofa með dökkbláum veggjum og brúnum leðursófa'),
      P('p-kameljon-3', 'Eldhús með dökkum innréttingum og messingljósum á vegg'),
      P('p-kameljon-4', 'Súla og stigi á milli stofu og eldhúss'),
      P('p-kameljon-5', 'Sjónvarpsstofa með ryðrauðum vegg og gráum hornsófa'),
      P('p-kameljon-6', 'Eldhúsið séð úr stofunni með myndverkum á bláum vegg'),
      P('p-kameljon-7', 'Messingljós á vegg yfir hillu í eldhúsinu'),
      P('p-kameljon-8', 'Rennihurð úr við við ganginn'),
      P('p-kameljon-9', 'Grár sófi og myndverk á ljósum vegg'),
      P('p-kameljon-10', 'Rennihurð úr við inn í svefnherbergi'),
      P('p-kameljon-11', 'Garður og hvítt útihús við húsið'),
    ],
    facts: [['Hlutverk', 'Endurhönnun og viðbygging'], ['Staðsetning', 'Hafnarfjörður']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'eldhus-i-107-sersmidi',
    title: 'Eldhús í 107, sérsmíði',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/eldhus-sersmidi/',
    lead: 'Eldhúsið flutt inn frá stofunni og opnað í gegn, með sérsmíðaðri eikarinnréttingu.',
    body: [
      'Hér var eldhúsið flutt í innra rýmið frá stofunni og opnað í gegn. Eldhúsið er bæði praktískt og stofulegt, þar sem stofan og eldhúsið eru í sama rýminu.',
      'Innréttingin er sérsmíðuð og liturinn á eikinni sérblandaður. Koparfilma var notuð á eyjuna stofumegin og einnig inni í tækjaskápnum, sem poppar upp eldhúsið og gerir það skemmtilegt og flott. Stólarnir eftir Daníel Magnússon fara einstaklega vel við.',
      'Myndirnar birtust í Hús og híbýli.',
    ],
    photos: [
      P('p-eldhus107-0', 'Eldhúsið opið inn í stofuna með eyju og háum innréttingum'),
      P('p-eldhus107-1', 'Opinn tækjaskápur í sérsmíðaðri eikarinnréttingu'),
      P('p-eldhus107-2', 'Skúffur í eyjunni séðar stofumegin'),
      P('p-eldhus107-3', 'Eyja með svartri borðplötu og hár skápur við gluggann'),
      P('p-eldhus107-4', 'Stofan sem deilir rými með eldhúsinu'),
    ],
    facts: [['Hlutverk', 'Hönnun eldhúss'], ['Gerð', 'Sérsmíði'], ['Staðsetning', '107 Reykjavík']],
  },

  /* ── Gistiheimili og hótel ───────────────────────────────────────────── */
  {
    slug: 'freyja-gistiheimili',
    title: 'Freyja gistiheimili',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/freyja-gistiheimili/',
    lead: 'Virðulegt hús á Freyjugötu, þar sem eigendurnir gáfu mér frjálsar hendur.',
    body: [
      'Mjög virðulegt og fallegt hús á Freyjugötu sem var mjög gaman að fá að vinna með. Falleg húsgögn í bland við gömul komu skemmtilega út, og ný baðherbergi og flottir litir fengu að njóta sín.',
      'Eigendurnir gáfu mér frjálsar hendur til að hanna, og þetta er útkoman.',
    ],
    photos: [
      P('p-freyja-0', 'Herbergi á Freyjugötu með djúpbláum vegg og ljósmynd af hestum'),
      P('p-freyja-1', 'Tveggja manna herbergi með bláum vegg og lömpum beggja vegna'),
      P('p-freyja-2', 'Setustofa með fjólubláum sófa og mynstruðum púðum'),
      P('p-freyja-4', 'Freyju-skiltið í steini og húsið að utan'),
      P('p-freyja-5', 'Gangur með ljósfjólubláum vegg og svart-hvítu flísagólfi'),
      P('p-freyja-3', 'Útsýni úr garðinum að Hallgrímskirkju að kvöldi'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiheimilis'], ['Gerð', 'Gistiheimili'], ['Staðsetning', 'Freyjugata, Reykjavík']],
  },
  {
    slug: 'freyja-luxusibud',
    title: 'Freyja lúxusíbúð',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/freyja-luxusibud/',
    lead: 'Lúxusíbúð í sérstakri einingu við Freyju gistiheimili, með sérsmíðuðum innréttingum.',
    body: [
      'Hér var gerð lúxusíbúð í sérstakri einingu við Freyju gistiheimili. Allar innréttingar eru sérsmíðaðar og mikið lagt upp úr því að gera íbúðina sem fallegasta, með tengingu við gistiheimilið.',
    ],
    photos: [
      P('p-freyjalux-0', 'Lúxusíbúðin við Freyju með sérsmíðaðri hillueiningu og tveimur rúmum'),
      P('p-freyjalux-1', 'Setustofa með fjólubláum sófa, sérsmíðaðri hillu og hengiljósi'),
      P('p-freyjalux-3', 'Snyrting með sexhyrndum flísum, lýstum sporöskjuspegli og dökkbláum dyrum'),
      P('p-freyjalux-4', 'Eldhúskrókur með vegglampa og útsýni út um gluggann'),
      P('p-freyjalux-2', 'Veggfóður og hengiljós í nærmynd'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun íbúðar'], ['Gerð', 'Lúxusíbúð'], ['Innréttingar', 'Sérsmíðaðar']],
  },
  {
    slug: 'svala-apartments',
    title: 'Svala Apartments',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/svala-apartments/',
    lead: 'Nýuppgerðar gistiíbúðir á Laugaveginum.',
    body: [
      'Nýuppgerðar gistiíbúðir á Laugaveginum, fallegar og vel útbúnar, með skemmtilegu útsýni, fallegum húsgögnum og myndum.',
      'Spuni, frægi verðlaunahesturinn, sómir sér vel þarna.',
    ],
    photos: [
      P('p-svala-0', 'Spuni, verðlaunahesturinn, í mynd á grænum vegg í Svala Apartments'),
      P('p-svala-1', 'Tvö rúm með ryðrauðum púðum og gluggum út að Laugavegi'),
      P('p-svala-4', 'Svefnherbergi með svölum, ryðrauðum stólum og borði'),
      P('p-svala-2', 'Borðkrókur með dökkum gardínum og hengiljósi'),
      P('p-svala-3', 'Stigi undir súð með ljósmynd af hesti'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiíbúða'], ['Gerð', 'Gistiíbúðir'], ['Staðsetning', 'Laugavegur, Reykjavík']],
  },
  {
    slug: 'solvallagata',
    title: 'Sólvallagata gistiheimili',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/solvallagata/',
    lead: 'Gullfallegt hús við Sólvallagötu, þar sem fallegu elementunum var haldið.',
    body: [
      'Gullfallegt hús við Sólvallagötu. Haldið var í fallegu elementin sem voru í húsinu og aðrir hlutir lagaðir.',
      'Kjallari hússins var endurhannaður og eldhúsi, baðaðstöðu og herbergjum komið vel fyrir. Fallegir litir og húsgögn gerðu svo lokahnykkinn.',
    ],
    photos: [
      P('p-solvallagata-1', 'Herbergi við Sólvallagötu með mynstruðu veggfóðri og tveimur náttborðum'),
      P('p-solvallagata-0', 'Gangur með sinnepsgulum vegg og upprunalegum hurðum'),
      P('p-solvallagata-2', 'Eldhús í endurhönnuðum kjallara með sinnepsgulum vegg'),
      P('p-solvallagata-3', 'Setustofa með blómamynd, hengiljósi og hringborðum'),
      P('p-solvallagata-4', 'Stigi með upprunalegu viðarhandriði'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiheimilis'], ['Staðsetning', 'Sólvallagata, Reykjavík']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'old-charm-reykjavik-apartment',
    title: 'Old Charm Reykjavik Apartment',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/old-charm-apt/',
    lead: 'Fjögur gömul hús og átta gistiíbúðir, eitt af mínum uppáhaldsverkefnum.',
    body: [
      'Þetta verkefni er eitt af mínum uppáhalds, þar sem þetta eru fjögur hús og átta gistiíbúðir.',
      'Í gömlu húsunum lögðum við mikið í að halda og laga gömlu elementin sem voru fyrir og hanna skemmtilega í kringum þau. Litir og fallegar hugmyndir fengu að skína, og árangurinn var samkvæmt því.',
    ],
    photos: [
      P('p-oldcharm-1', 'Svefnherbergi í Old Charm með ljósbláu panelþili, furugólfi og hengiljósi'),
      P('p-oldcharm-0', 'Eitt af fjórum húsunum að utan, rautt og grátt bárujárn með hvítum tröppum'),
      P('p-oldcharm-2', 'Svart bárujárnshús við götuna í miðborginni'),
      P('p-oldcharm-5', 'Setustofa með furuþiljum, bláum sófa og tveimur hengiljósum'),
      P('p-oldcharm-3', 'Baðherbergi undir súð með túrkisbláum flísum og sturtuklefa'),
      P('p-oldcharm-4', 'Baðherbergi með túrkisbláu gólfi, karbaðkari og glerskáp'),
      P('p-oldcharm-7', 'Eldhúskrókur undir súð með rauðum gluggakarmi og viðarborðplötu'),
      P('p-oldcharm-6', 'Gangur með upprunalegum múrsteinsstromp'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiíbúða'], ['Umfang', 'Fjögur hús og átta gistiíbúðir']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'hotel-hekla',
    title: 'Hótel Hekla',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/hotel-hekla/',
    lead: 'Ný álma, matsalur, bar og eldri álma, með náttúruna fyrir utan tekna inn í rýmið.',
    body: [
      'Yndislegt verkefni í sveitinni. Ég hannaði allt frá grunni í nýrri álmu við hótelið, sem tekin var í notkun, ásamt því að hanna matsalinn, barinn og eldri álmuna.',
      'Náttúran fyrir utan skilaði sér inn í rýmið með því að nota fuglana og litina.',
    ],
    photos: [
      P('p-hekla-6', 'Matsalur Hótels Heklu með mosagrænum vegg, fléttuðum ljósum og bláum stólum'),
      P('p-hekla-0', 'Hótelherbergi undir súð með bólstruðum rúmgafli og mintugrænum vegg'),
      P('p-hekla-5', 'Barinn með ljósaskerm skreyttum fuglum og glerhillum'),
      P('p-hekla-1', 'Baðherbergi með appelsínugulum flísavegg og baðkari'),
      P('p-hekla-2', 'Eldhúskrókur með ljósbláum innréttingum og opnum viðarhillum'),
      P('p-hekla-3', 'Setuhorn með bláum svefnsófa og fuglapúðum'),
      P('p-hekla-7', 'Herbergi með stól, fataskáp og bakka með katli'),
      P('p-hekla-4', 'Setuhorn við glugga með gardínu og koparlituðum smáborðum'),
    ],
    facts: [['Hlutverk', 'Ný álma, matsalur, bar og eldri álma'], ['Gerð', 'Hótel']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },

  /* ── Atvinnuhúsnæði ──────────────────────────────────────────────────── */
  {
    slug: 'skrifstofurymi',
    title: 'Skrifstofurými',
    category: 'atvinnuhusnaedi',
    oldPath: '/verkefni/atvinnuhusnaedi/skrifstofurymi/',
    lead: 'Skemmtileg og fjölbreytt skrifstofurými, hönnuð í anda fyrirtækjanna sem þar starfa.',
    body: [
      'Hér má finna skrifstofurými sem eru skemmtileg og fjölbreytt. Það er gefandi og skemmtilegt að fá að hanna rýmin í anda þeirra fyrirtækja sem þar starfa.',
      'Þarfirnar eru misjafnar, en flest fyrirtækin sem ég hef hannað fyrir hafa haft þá sameiginlegu ósk að stíllinn sé hlýlegur og rýmið vel skipulagt, með góðu flæði og skemmtilegri hönnun sem tekið er eftir.',
      'Meðal verkefnanna eru skrifstofur Lánasjóðs sveitarfélaga, Samkennd Heilsusetur, Alfreð Atvinnuleit, Digido og Múr & Mál.',
    ],
    photos: [
      P('p-skrifstofa-1', 'Skrifstofurými með opnu vinnusvæði, bókahillum og appelsínugulum barstólum'),
      P('p-skrifstofa-0', 'Setuhorn á skrifstofu með gráum sófa og terracotta stól'),
      P('p-skrifstofa-3', 'Fundarrými með plómurauðum veggjum, háu borði og pílukastspjaldi'),
      P('p-skrifstofa-5', 'Glerskilrúm með laufamynstri sem grafísk hönnun'),
      P('p-skrifstofa-4', 'Gangur með glerskilrúmum, gróðurkeri og teppi'),
      P('p-skrifstofa-6', 'Hurð og glerveggur með laufamynstri inn í fundarherbergi'),
      P('p-skrifstofa-7', 'Setustofa með fléttuljósi, sófa og gróðurmynstruðum vegg'),
      P('p-skrifstofa-2', 'Merking heilsuseturs á viðarvegg í móttöku'),
    ],
    facts: [['Hlutverk', 'Hönnun skrifstofurýma'], ['Gerð', 'Atvinnuhúsnæði']],
  },
  {
    slug: 'tannlaeknastofan-gardatorgi',
    title: 'Tannlæknastofan Garðatorgi',
    category: 'atvinnuhusnaedi',
    oldPath: '/verkefni/atvinnuhusnaedi/tannlaeknastofa/',
    lead: 'Notaleg, afslappandi og falleg tannlæknastofa.',
    body: [
      'Tannlæknastofan á að vera notaleg, afslappandi og falleg, og veggfóðrið poppar skemmtilega upp rýmið.',
    ],
    photos: [
      P('p-tannlaeknar-0', 'Móttaka tannlæknastofunnar á Garðatorgi með bogadregnu afgreiðsluborði'),
      P('p-tannlaeknar-6', 'Opið vinnurými með skjáum og veggfóðri sem mýkir rýmið'),
      P('p-tannlaeknar-5', 'Meðferðarstofa með stól við glugga'),
      P('p-tannlaeknar-1', 'Snyrting með lýstum sporöskjulaga spegli og viðarklæðningu'),
      P('p-tannlaeknar-2', 'Snyrting með stórum lýstum spegli og ljósri innréttingu'),
      P('p-tannlaeknar-3', 'Hillur með innfelldri lýsingu fyrir búnað'),
      P('p-tannlaeknar-4', 'Gangur með glerskáp og viðarklæðningu'),
      P('p-tannlaeknar-7', 'Vinnuborð með vaski og viðarinnréttingu'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun tannlæknastofu'], ['Staðsetning', 'Garðatorg, Garðabær'], ['Gerð', 'Heilbrigðisrými']],
  },

  /* ── Ýmislegt ────────────────────────────────────────────────────────── */
  {
    slug: 'stemning',
    title: 'Stemning',
    category: 'ymislegt',
    oldPath: '/verkefni/ymislegt/stemning/',
    lead: 'Það verður að vera gaman.',
    body: [
      'Hér er stemning í skemmtilegri hönnun sem gerir útkomu verkefnisins bæði skemmtilega, frumlega og sérstæða.',
    ],
    photos: [
      P('p-stemning-1', 'Stofa með steinvegg, bláum chesterfield-sófa, rauðum Egg-stól og sebrateppi'),
      P('p-stemning-0', 'Gestasalerni með sexhyrndum flísum og kringlóttum lýstum spegli'),
      P('p-stemning-3', 'Snyrting með korallrauðu lofti, kringlóttum spegli í ól og dökkri innréttingu'),
      P('p-stemning-7', 'Skrifstofa með lýstum kringlóttum spegli á rauðum vegg og laufskornum skilvegg'),
      P('p-stemning-5', 'Salerni með grænum flísum, korallrauðum vegg og trjábolskolli'),
      P('p-stemning-4', 'Hilla með messingfuglum og lituðum glösum'),
      P('p-stemning-2', 'Listaverkaveggur og eldhús með hangandi ljósi'),
      P('p-stemning-6', 'Tímaritahillur yfir skjalaskápum á skrifstofu'),
    ],
    facts: [['Hlutverk', 'Stemning úr ólíkum verkefnum'], ['Gerð', 'Stemningsmyndir']],
  },
]

export const PROJECT_COUNT = PROJECTS.length
export const PHOTOGRAPHED = PROJECTS.filter((p) => p.photos.length > 0)
export const byCategory = (c: CategorySlug) => PROJECTS.filter((p) => p.category === c)
export const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)
/** Only projects with photography get a page; a stub page ranks for nothing. */
export const hasPage = (p: Project) => p.photos.length > 0
