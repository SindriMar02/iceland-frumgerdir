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
 * Every description below is written from what is actually visible in her own
 * photographs plus what the category tells us. No client names, no floor
 * areas, no budgets, no dates beyond the ones she published.
 */

export type CategorySlug = 'innanhusshonnun' | 'gistiheimili-og-hotel' | 'atvinnuhusnaedi' | 'ymislegt'

export interface Photo {
  /** key into photo-dims.json */
  id: string
  alt: string
}

export interface Project {
  slug: string
  /** Her own title. */
  title: string
  category: CategorySlug
  /** One line under the title, and the meta description seed. */
  lead: string
  /** Two or three short paragraphs. Grounded in the photographs. */
  body: string[]
  photos: Photo[]
  /** Short factual pairs shown as a definition list. */
  facts?: Array<[string, string]>
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
      'Í atvinnuhúsnæði er hönnunin hluti af þjónustunni. Móttakan segir til um hvers konar fyrirtæki tekur á móti þér, biðstofan ræður hvort bið líður hratt eða hægt, og starfsfólkið vinnur í rýminu alla daga. Katrín hefur hannað bæði skrifstofurými og heilbrigðisrými.',
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
    lead: 'Nýbygging teiknuð innan frá: vínrautt eldhús, kopar og ljós steinn.',
    body: [
      'Húsið var hannað að innan frá grunni, samhliða byggingunni sjálfri, svo innréttingar og lýsing eru hluti af húsinu en ekki lagðar ofan á það eftir á. Það sést best á eldhúsinu, þar sem vínrauð eyja stendur ein í ljósu rými undir koparljósum, og á arinveggnum úr ljósum steini þar sem eldiviðarhólfin eru hluti af múrverkinu.',
      'Efnispallettan gengur í gegnum allt húsið. Sami dökki viðurinn kemur fyrir í innbyggðum glerskáp í stofunni og í fataherberginu, þar sem slárnar eru lýstar innan frá. Baðherbergin halda sama tóni með bogadregnum lýstum spegli og steinvaski.',
      'Þetta er verkefnið sem sýnir best hvað átt er við með heildarhönnun: eitt hús, ein efnisákvörðun, tekin einu sinni og haldið út í gegn.',
    ],
    photos: [
      P('s-eldhus-vitt', 'Eldhús í Súluhöfða með vínrauðri eyju, koparljósum og útsýni yfir voginn'),
      P('s-eyja', 'Vínrauð eldhúseyja með svörtum blöndunartækjum og koparljósum'),
      P('s-arinn', 'Arinveggur úr ljósum steini með eldiviðarhólfum og faldri lýsingu'),
      P('s-skapur', 'Innbyggður glerskápur með lýsingu og dökkum viðaráferðum'),
      P('s-fot', 'Fataherbergi með lýstum slám og ljósum innréttingum'),
      P('s-bad', 'Baðherbergi með bogadregnum lýstum spegli og steinvaski'),
      P('s-sturta', 'Sturturými með dökkum steinvegg og grænni plöntu'),
    ],
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Nýbygging'], ['Staða', 'Lokið']],
  },
  {
    slug: 'sumarhus-i-fljotshlidinni',
    title: 'Sumarhús í Fljótshlíðinni',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/sumarhus-fljotshlid/',
    lead: 'Hör, dagsbirta og timburbitar undir suðurlenskri birtu.',
    body: [
      'Sumarhús vinnur með aðra birtu en hús í borginni. Hér er allt efnisval miðað við það: hörgardínur sem sía dagsljósið frekar en að loka fyrir það, ljós veggir sem endurkasta því lengra inn, og leðurstóll sem dekkist með árunum í stað þess að slitna.',
      'Borðstofan situr undir berum timburbitum með einu kúpulljósi, og borðkrókurinn snýr að útsýninu með bogalampa yfir. Eldhúsið er með dökkri eyju og barstólum, mótvægi við ljósa rýmið í kring.',
    ],
    photos: [
      P('f-stofa', 'Stofa sumarhússins með hörgardínum, hangandi ljósi og leðurstól'),
      P('f-eldhus', 'Eldhús sumarhússins með barstólum og mjúku dagsljósi'),
      P('f-eyja', 'Dökk eldhúseyja sumarhússins með blómum'),
      P('f-krokur', 'Borðkrókur með bogalampa og útsýni út í hlíðina'),
      P('f-bitar', 'Borðstofa undir timburbitum með kúpulljósi'),
    ],
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Sumarhús'], ['Staðsetning', 'Fljótshlíð']],
  },
  {
    slug: 'eldhusrymi-i-skuggahverfi',
    title: 'Eldhúsrými í Skuggahverfi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/eldhusrymi-i-skuggahverfi/',
    lead: 'Dökkt eldhús í nýrri íbúð í miðborginni.',
    body: [
      'Íbúðir í Skuggahverfi eru með stórum gluggum og mikilli birtu, sem þolir dekkri innréttingu en flest önnur rými. Eldhúsið er því haldið dökku: viðarinnréttingar, innfelld lýsing undir efri skápum og eyja sem afmarkar eldhúsið frá stofunni án þess að loka á milli.',
      'Lýsingin er stór hluti verkefnisins. Innfelld lýsing í vinnuhæð, punktljós yfir eyjunni og almenn lýsing í loftinu vinna saman svo rýmið virki jafnvel á dimmasta tíma ársins.',
    ],
    photos: [
      P('p-skuggahverfi-0', 'Dökkt eldhús með eyju, viðarinnréttingum og innfelldri lýsingu'),
      P('p-skuggahverfi-1', 'Eldhúsrými í Skuggahverfi séð frá stofunni'),
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Staðsetning', 'Skuggahverfi, Reykjavík']],
  },
  {
    slug: 'eldhusrymi-i-skandinaviskum-stil',
    title: 'Eldhúsrými í skandinavískum stíl',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/eldhusrymi-i-skandinaviskum-stil/',
    lead: 'Ljós viður, hvítar framhliðar og eitt langt borð.',
    body: [
      'Skandinavískur stíll er oftast misskilinn sem litleysi. Hér er hann frekar spurning um efni: ljós viður sem heldur æðunum sýnilegum, hvítar mattar framhliðar án handfanga, og eitt langt viðarborð sem er raunverulega notað.',
      'Eyjan er höfð grönn svo hún þrengi ekki að gangveginum, og hangandi ljósin yfir henni eru einu áberandi hlutirnir í rýminu.',
    ],
    photos: [
      P('p-skandinaviskt-0', 'Ljóst eldhús með eyju, viðarborði og hangandi ljósum'),
      P('p-skandinaviskt-1', 'Eldhúsið í skandinavískum stíl séð eftir endilöngu rýminu'),
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Stíll', 'Skandinavískur']],
  },
  {
    slug: 'eldhusrymi',
    title: 'Eldhúsrými',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/eldhusrymi/',
    lead: 'Opið eldhús og borðstofa sem eru hönnuð sem eitt rými.',
    body: [
      'Þegar eldhús og borðstofa deila rými ræðst útkoman af því hvernig skilin á milli eru meðhöndluð. Hér er kringlótt borð látið taka við af beinu línunum í innréttingunni, sem mýkir umskiptin og gerir umferðina í kringum borðið eðlilega.',
      'Innréttingin er höfð látlaus svo borðið og lýsingin fái að vera það sem sést.',
    ],
    photos: [
      P('p-eldhusrymi-0', 'Opið eldhús og borðstofa með kringlóttu borði'),
      P('p-eldhusrymi-1', 'Eldhúsinnrétting með innfelldum tækjum og ljósri borðplötu'),
    ],
    facts: [['Hlutverk', 'Hönnun eldhúss og borðstofu']],
  },
  {
    slug: 'alfheimar',
    title: 'Álfheimar',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/alfheimar/',
    lead: 'Stofa í eldra fjölbýli, byggð í kringum eitt listaverk.',
    body: [
      'Í eldri íbúðum er oft eitt atriði sem allt annað ætti að raðast í kringum. Hér er það stórt listaverk á langveggnum. Dökkur sófi er settur á móti því og restin af rýminu höfð róleg, svo verkið haldi athyglinni.',
      'Lýsingin er lág og hlý frekar en almenn loftlýsing, sem er það sem gerir eldri stofur notalegar á kvöldin.',
    ],
    photos: [
      P('p-alfheimar-0', 'Stofa með dökkum sófa og stóru listaverki á vegg'),
      P('p-alfheimar-1', 'Stofan í Álfheimum séð frá hinu horninu'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun stofu'], ['Staðsetning', 'Álfheimar, Reykjavík']],
  },
  {
    slug: 'hus-i-gardabae',
    title: 'Hús í Garðabæ',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/hus-i-gardabae/',
    lead: 'Stofa með kringlóttum spegli, dökkum sófa og leðurstól.',
    body: [
      'Einbýlishús í Garðabæ með rúmri lofthæð. Kringlóttur spegill er notaður til að brjóta upp langa veggi og skila birtu til baka inn í rýmið, sem er einfaldasta leiðin til að láta stórt herbergi virka minna tómt.',
      'Húsgögnin eru fá og stór frekar en mörg og smá, sem er það sem heldur rýminu rólegu.',
    ],
    photos: [P('p-gardabaer-0', 'Stofa með kringlóttum spegli, dökkum sófa og leðurstól')],
    facts: [['Hlutverk', 'Innanhússhönnun'], ['Staðsetning', 'Garðabær']],
  },
  {
    slug: 'badherbergi',
    title: 'Baðherbergi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/badherbergi/',
    lead: 'Nokkur dæmi um baðherbergi úr ólíkum verkefnum.',
    body: [
      'Baðherbergi er minnsta rýmið í húsinu og það eina þar sem hver sentimetri er sýnilegur. Þess vegna er það líka rýmið þar sem sérsmíðuð innrétting skilar mestu: vaskborð sem er nákvæmlega jafnbreitt veggnum lítur allt öðruvísi út en staðalstærð með sílikonrönd á báðum hliðum.',
      'Dæmin hér eru úr ólíkum verkefnum og sýna sama vinnulag: sporöskjulaga eða bogadregnir speglar á móti beinum línum innréttingarinnar, og lýsing sem er sett við spegilinn frekar en fyrir aftan höfuðið á þeim sem stendur við hann.',
    ],
    photos: [
      P('p-badherbergi-0', 'Baðherbergi með sporöskjulaga spegli og dökkri innréttingu'),
      P('p-badherbergi-1', 'Baðherbergi með sérsmíðaðri innréttingu og faldri lýsingu'),
    ],
    facts: [['Hlutverk', 'Hönnun baðherbergja'], ['Umfang', 'Nokkur verkefni']],
  },
  {
    slug: 'barnaherbergi',
    title: 'Barnaherbergi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/barnaherbergi/',
    lead: 'Blátt herbergi sem á að endast lengur en eitt aldursskeið.',
    body: [
      'Barnaherbergi eldast hraðar en önnur rými, þannig að hönnunin þarf að þola að barnið vaxi. Hér er liturinn látinn bera herbergið, blár veggur sem hægt er að skipta um fylgihluti við, frekar en að byggja innréttinguna í kringum eitt þema.',
      'Röndótt teppi og einföld rúmstæði halda restinni hlutlausri.',
    ],
    photos: [P('p-barnaherbergi-0', 'Barnaherbergi með bláum veggjum, rúmi og röndóttu teppi')],
    facts: [['Hlutverk', 'Innanhússhönnun barnaherbergis']],
  },
  {
    slug: 'honnunar-studio',
    title: 'Hönnunar Studio',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/honnunar-studio/',
    lead: 'Stúdíóið hennar sjálfrar, þar sem efnin eru valin.',
    body: [
      'Stúdíóið er líka sýningarrými. Hér liggja sýnishorn af borðplötum, framhliðum og efnum sem viðskiptavinir handleika áður en ákvörðun er tekin, því munurinn á tveimur steintegundum sést ekki á skjá.',
      'Dökk marmaraborðplata er miðja rýmisins og um leið dæmi um það sem verið er að selja.',
    ],
    photos: [
      P('p-studio-1', 'Dökk marmaraborðplata í sýningarrými stúdíósins'),
      P('p-studio-0', 'Sýningarrými stúdíósins með efnissýnishornum'),
    ],
    facts: [['Hlutverk', 'Eigið stúdíó og sýningarrými'], ['Staðsetning', 'Reykjavík']],
  },
  {
    slug: 'fjallalind',
    title: 'Fjallalind',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/fjallalind/',
    lead: 'Verkefni úr skránni.',
    body: [],
    photos: [],
  },
  {
    slug: 'fallegt-hus-i-kopavogi',
    title: 'Fallegt hús í Kópavogi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/hus-i-kopavogi/',
    lead: 'Verkefni úr skránni.',
    body: [],
    photos: [],
  },
  {
    slug: 'laugalaekur-fataherbergi',
    title: 'Laugalækur, fataherbergi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/laugalaekur/',
    lead: 'Verkefni úr skránni.',
    body: [],
    photos: [],
  },

  /* ── Gistiheimili og hótel ───────────────────────────────────────────── */
  {
    slug: 'freyja-gistiheimili',
    title: 'Freyja gistiheimili',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/freyja-gistiheimili/',
    lead: 'Gistiheimili þar sem hvert herbergi hefur sinn lit en sama efnisval.',
    body: [
      'Gistiheimili selur herbergi, ekki hús, þannig að hvert herbergi verður að standa eitt og sér á mynd. Hér er það leyst með því að halda innréttingum, rúmum og ljósum eins í öllum herbergjum en gefa hverju herbergi sinn veggjalit, svo gestur sem sér tvö herbergi á sömu bókunarsíðu sjái tvo ólíka valkosti í sama húsi.',
      'Ljós gluggatjöld eru notuð til að hleypa dagsbirtunni inn án þess að gefa eftir næði á jarðhæð.',
    ],
    photos: [
      P('p-freyja-0', 'Gestaherbergi á Freyju með bláum vegg og ljósum gluggatjöldum'),
      P('p-freyja-1', 'Annað gestaherbergi á Freyju gistiheimili'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiheimilis'], ['Gerð', 'Gistiheimili']],
  },
  {
    slug: 'freyja-luxusibud',
    title: 'Freyja lúxusíbúð',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/freyja-luxusibud/',
    lead: 'Efsta verðlagið í sama húsi, aðgreint með efnum frekar en stærð.',
    body: [
      'Lúxusíbúð í sama rekstri og gistiheimilið þarf að réttlæta hærra verð á mynd, áður en gesturinn kemur. Hér er það gert með innbyggðum hillum, mýkri efnum og rólegri litum frekar en fleiri fermetrum.',
      'Svefnherbergið er haldið gráu og hlutlausu, sem er það sem lætur rúmið sjálft líta út fyrir að vera dýrara.',
    ],
    photos: [
      P('p-freyjalux-0', 'Svefnherbergi með gráu rúmi og innbyggðum hillum'),
      P('p-freyjalux-1', 'Stofurými lúxusíbúðarinnar á Freyju'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun íbúðar'], ['Gerð', 'Lúxusgisting']],
  },
  {
    slug: 'svala-apartments',
    title: 'Svala Apartments',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/svala-apartments/',
    lead: 'Gistiíbúðir með grænum vegg og einu myndverki á hverju herbergi.',
    body: [
      'Í gistiíbúðum þarf hvert herbergi eitt atriði sem gestur man eftir og myndar. Hér er það sterkur grænn veggur og eitt myndverk, hestur, á móti honum.',
      'Restin er höfð einföld og endingargóð, því gistirými fá margfalt meira álag en heimili.',
    ],
    photos: [P('p-svala-0', 'Gestaherbergi með grænum vegg og listaverki af hesti')],
    facts: [['Hlutverk', 'Innanhússhönnun gistiíbúða'], ['Gerð', 'Gistiíbúðir']],
  },
  {
    slug: 'solvallagata',
    title: 'Sólvallagata gistiheimili',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/solvallagata/',
    lead: 'Eldra hús í Vesturbænum, þar sem stiginn er látinn vera aðalatriðið.',
    body: [
      'Í eldri húsum sem breytt er í gistingu er stiginn það fyrsta sem gestur snertir. Hér er hann hafður hvítur með viðarhandriði, sem heldur upprunalega handbragðinu sýnilegu án þess að rýmið verði þungt.',
      'Ljós litapalletta í sameigninni gerir þröng eldri rými bjartari en þau eru.',
    ],
    photos: [P('p-solvallagata-1', 'Hvítur stigagangur með viðarhandriði á Sólvallagötu')],
    facts: [['Hlutverk', 'Innanhússhönnun gistiheimilis'], ['Staðsetning', 'Sólvallagata, Reykjavík']],
  },
  {
    slug: 'old-charm-reykjavik-apartment',
    title: 'Old Charm Reykjavik Apartment',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/old-charm-apt/',
    lead: 'Íbúð í eldra húsi þar sem upprunalegu smíðinni er haldið.',
    body: [
      'Verkefnið snerist um að endurnýja án þess að má út það sem gerir eldra hús eftirsótt. Timburbitarnir í loftinu eru látnir standa og svefnherbergið byggt undir þeim, frekar en að klæða yfir þá.',
      'Nýju hlutirnir eru hafðir hlutlausir svo það gamla sé það sem sést.',
    ],
    photos: [P('p-oldcharm-1', 'Svefnherbergi undir upprunalegum timburbitum')],
    facts: [['Hlutverk', 'Innanhússhönnun íbúðar'], ['Gerð', 'Gistiíbúð í eldra húsi']],
  },
  {
    slug: 'hotel-hekla',
    title: 'Hótel Hekla',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/hotel-hekla/',
    lead: 'Verkefni úr skránni.',
    body: [],
    photos: [],
  },

  /* ── Atvinnuhúsnæði ──────────────────────────────────────────────────── */
  {
    slug: 'skrifstofurymi',
    title: 'Skrifstofurými',
    category: 'atvinnuhusnaedi',
    oldPath: '/verkefni/atvinnuhusnaedi/skrifstofurymi/',
    lead: 'Skrifstofa með setusvæði sem er raunverulega notað.',
    body: [
      'Setusvæði á skrifstofu virkar aðeins ef það er nógu þægilegt til að fólk velji það fram yfir fundarherbergið. Hér er grár sófi settur upp á móti rauðum stól, sem gefur rýminu lit án þess að fara út í skrifstofuhúsgagnastaðla.',
      'Efnisvalið er miðað við daglegt álag frekar en kynningarmyndir.',
    ],
    photos: [
      P('p-skrifstofa-0', 'Skrifstofurými með gráum sófa og rauðum stól'),
      P('p-skrifstofa-1', 'Vinnusvæði skrifstofunnar með innbyggðum skápum'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun skrifstofu'], ['Gerð', 'Atvinnuhúsnæði']],
  },
  {
    slug: 'tannlaeknastofan-gardatorgi',
    title: 'Tannlæknastofan Garðatorgi',
    category: 'atvinnuhusnaedi',
    oldPath: '/verkefni/atvinnuhusnaedi/tannlaeknastofa/',
    lead: 'Móttaka og biðstofa þar sem hönnunin vinnur á móti kvíða.',
    body: [
      'Tannlæknastofa er rými sem hluti gesta kvíðir fyrir að koma í. Það gerir móttökuna og biðstofuna að raunverulegu hönnunarverkefni frekar en skreytingu: ljóst afgreiðsluborð, mjúk lýsing og hlýir litir gera meira fyrir upplifun sjúklings en nokkur skilti.',
      'Efnin eru valin til að þola sótthreinsun og þrif, sem er hörð krafa í heilbrigðisrými og útilokar stóran hluta þess sem virkar á heimili.',
    ],
    photos: [P('p-tannlaeknar-0', 'Móttaka tannlæknastofu með ljósum afgreiðsluborði')],
    facts: [['Hlutverk', 'Hönnun móttöku og biðstofu'], ['Staðsetning', 'Garðatorg, Garðabær'], ['Gerð', 'Heilbrigðisrými']],
  },

  /* ── Ýmislegt ────────────────────────────────────────────────────────── */
  {
    slug: 'fjolmidlar',
    title: 'Fjölmiðlar',
    category: 'ymislegt',
    oldPath: '/verkefni/ymislegt/fjolmidlar/',
    lead: 'Umfjöllun um verkefni Katrínar.',
    body: [],
    photos: [],
  },
  {
    slug: 'stemning',
    title: 'Stemning',
    category: 'ymislegt',
    oldPath: '/verkefni/ymislegt/stemning/',
    lead: 'Stemningsmyndir úr verkefnum.',
    body: [],
    photos: [],
  },
]

export const PROJECT_COUNT = PROJECTS.length
export const PHOTOGRAPHED = PROJECTS.filter((p) => p.photos.length > 0)
export const byCategory = (c: CategorySlug) => PROJECTS.filter((p) => p.category === c)
export const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)
/** Only projects with photography get a page; a stub page ranks for nothing. */
export const hasPage = (p: Project) => p.photos.length > 0
