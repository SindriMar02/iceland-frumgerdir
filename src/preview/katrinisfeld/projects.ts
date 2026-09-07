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
      'Húsið var enn í byggingu þegar Katrín kom að því, svo innra skipulaginu var breytt áður en það var múrað fast og innréttingar og lýsing urðu hluti af húsinu í stað þess að leggjast ofan á það eftir á. Það sést best á eldhúsinu, þar sem vínrauð eyja stendur ein í ljósu rými undir koparljósum, og á arinveggnum úr ljósum steini þar sem eldiviðarhólfin eru hluti af múrverkinu.',
      'Efnispallettan gengur í gegnum allt húsið. Sami dökki viðurinn kemur fyrir í innbyggðum glerskáp í stofunni og í fataherberginu, þar sem slárnar eru lýstar innan frá. Baðherbergin halda sama tóni með bogadregnum lýstum spegli og steinvaski.',
      'Þetta er verkefnið sem sýnir best hvað átt er við með heildarhönnun: eitt hús, ein efnisákvörðun, tekin einu sinni og haldið út í gegn.',
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
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Nýbygging'], ['Innréttingar', 'Arrital'], ['Flísar', 'Egill Árnason']],
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
      P('f-eldhus', 'Eldhús sumarhússins með Arrital innréttingum og mjúku dagsljósi'),
      P('f-eyja', 'Dökk eldhúseyja sumarhússins með blómum'),
      P('f-krokur', 'Borðkrókur með bogalampa og útsýni út í hlíðina'),
      P('f-bitar', 'Borðstofa undir timburbitum með kúpulljósi'),
      P('p-fljotshlid-0', 'Forstofa með terrazzógólfi og hornum á vegg'),
      P('p-fljotshlid-1', 'Svefnherbergi með dökkgrænum vegg og hengiljósi'),
      P('p-fljotshlid-2', 'Sturta með terracotta zellige-flísum á móti terrazzó'),
    ],
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Sumarhús'], ['Staðsetning', 'Fljótshlíð'], ['Innréttingar', 'Arrital']],
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
    lead: 'Ljós viður, hvítar framhliðar og eitt langt borð.',
    body: [
      'Skandinavískur stíll er oftast misskilinn sem litleysi. Hér er hann frekar spurning um efni: ljós viður sem heldur æðunum sýnilegum, hvítar mattar framhliðar án handfanga, og eitt langt viðarborð sem er raunverulega notað.',
      'Eyjan er höfð grönn svo hún þrengi ekki að gangveginum, og hangandi ljósin yfir henni eru einu áberandi hlutirnir í rýminu.',
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
    lead: 'Opið eldhús og borðstofa sem eru hönnuð sem eitt rými.',
    body: [
      'Þegar eldhús og borðstofa deila rými ræðst útkoman af því hvernig skilin á milli eru meðhöndluð. Hér er kringlótt borð látið taka við af beinu línunum í innréttingunni, sem mýkir umskiptin og gerir umferðina í kringum borðið eðlilega.',
      'Innréttingin er höfð látlaus svo borðið og lýsingin fái að vera það sem sést.',
    ],
    photos: [
      P('p-eldhusrymi-0', 'Eldhúsrými með grágrænum vegg, ljósum innréttingum og pappírsljósum'),
      P('p-eldhusrymi-1', 'Eldhús með tveimur kúluljósum og barstólum við eyju'),
      P('p-eldhusrymi-2', 'Eldhús í gegnumgangandi rými með stálskáp og gluggum í enda'),
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
      P('p-alfheimar-0', 'Stofa á hæð í Sigvalda Thordarson húsi með stóru mósaíkverki og svörtum leðursófa'),
      P('p-alfheimar-6', 'Svefnherbergi með bláum vegg, bólstruðum rúmgafli og upprunalegum tekkfataskáp'),
      P('p-alfheimar-2', 'Gangur með dumbrauðum ísskáp, svörtum ofnum og skógarmynd á vegg'),
      P('p-alfheimar-4', 'Snyrting með korallrauðu lofti, kringlóttum spegli í leðuról og dökkri innréttingu'),
      P('p-alfheimar-5', 'Salerni með grænum flísum frá byggingartímanum og trjábolskolli'),
      P('p-alfheimar-3', 'Rýmisskil úr opinni hillu með veggfóðri og kertastjökum'),
      P('p-alfheimar-1', 'Borðkrókur með hvítu hengiljósi, tímaritahillum og viðarborði'),
      P('p-alfheimar-7', 'Kertastjakar og plöntur við dumbrauðan vegg'),
    ],
    facts: [['Hlutverk', 'Innanhússhönnun stofu'], ['Staðsetning', 'Álfheimar, Reykjavík']],
    credit: 'Eggert Jóhannesson',
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
    lead: 'Nokkur dæmi um baðherbergi úr ólíkum verkefnum.',
    body: [
      'Baðherbergi er minnsta rýmið í húsinu og það eina þar sem hver sentimetri er sýnilegur. Þess vegna er það líka rýmið þar sem sérsmíðuð innrétting skilar mestu: vaskborð sem er nákvæmlega jafnbreitt veggnum lítur allt öðruvísi út en staðalstærð með sílikonrönd á báðum hliðum.',
      'Dæmin hér eru úr ólíkum verkefnum og sýna sama vinnulag: sporöskjulaga eða bogadregnir speglar á móti beinum línum innréttingarinnar, og lýsing sem er sett við spegilinn frekar en fyrir aftan höfuðið á þeim sem stendur við hann.',
    ],
    photos: [
      P('p-badherbergi-0', 'Baðherbergi á Hávallagötu með kringlóttum spegli, dökkri innréttingu og skálavaski'),
      P('p-badherbergi-1', 'Baðherbergi með opnu sturtusvæði, svörtum blöndunartækjum og innfelldri lýsingu'),
      P('p-badherbergi-4', 'Sturtuklefi með svörtum regnhaus og innfelldri hillu'),
      P('p-badherbergi-5', 'Baðherbergi með kringlóttum spegli, kúluljósi og ljósum flísum'),
      P('p-badherbergi-6', 'Sturtuklefi með glerhurð, handklæðaofni og baðkari'),
      P('p-badherbergi-7', 'Sturtuveggur með svörtum regnhaus og faldri lýsingu við loft'),
      P('p-badherbergi-2', 'Baðherbergi í Árbæ með ljósum flísum og svífandi innréttingu'),
      P('p-badherbergi-3', 'Baðherbergi með svörtum blöndunartækjum og skálavaski á dökkri plötu'),
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
    lead: 'Stúdíóið hennar sjálfrar, þar sem efnin eru valin.',
    body: [
      'Stúdíóið er líka sýningarrými. Hér liggja sýnishorn af borðplötum, framhliðum og efnum sem viðskiptavinir handleika áður en ákvörðun er tekin, því munurinn á tveimur steintegundum sést ekki á skjá.',
      'Dökk marmaraborðplata er miðja rýmisins og um leið dæmi um það sem verið er að selja.',
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
    lead: 'Aðalhæð opnuð í eitt rými, með hljóðvistina hannaða inn í loftið.',
    body: [
      'Aðalhæð hússins var tekin í gegn í heild. Stór veggur var fjarlægður og eldhúsið opnað inn í stofu- og borðstofurýmið, og forstofuveggirnir fóru sömu leið svo forstofan gengur nú inn með ganginum í stað þess að enda á vegg.',
      'Þegar rými er opnað þannig fylgir hljóðið með, og því var hljóðvistin hönnuð inn í húsið frá byrjun: hljóðdúkur í öllu loftinu og hljóðdempandi trérimlar á veggjum og í lofti þar sem rýmið er hæst. Rimlarnir eru bæði hljóðlausn og efnisval, og þeir eru það sem heldur stóra rýminu saman.',
      'Litirnir eru fáir og mettaðir: plómurauður veggur gengur í gegnum forstofuna og eldhúsið, dökkur steinn í borðplötu og baðherbergi, og ein hlýrri okkurhæð í setustofunni. Baðherbergið fær sinn eigin tón með bogadregnum lýstum spegli og gulu baðkari.',
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
    facts: [['Hlutverk', 'Öll innanhússhönnun aðalhæðar'], ['Gerð', 'Endurhönnun'], ['Áhersla', 'Hljóðvist og opið flæði']],
  },
  {
    slug: 'fallegt-hus-i-kopavogi',
    title: 'Fallegt hús í Kópavogi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/hus-i-kopavogi/',
    lead: 'Húsið var þegar stórkostlegt að utan; að innan vantaði samhljóminn.',
    body: [
      'Húsið er einstaklega vel hannað að utan, og verkefnið var að taka það allt í gegn að innan svo samhljómur næðist milli utanhússhönnunar og innanhússins. Það þýddi að hvert rými var tekið fyrir: eldhús, stofa, gangar, baðherbergi og gestasalerni.',
      'Efnin bera húsið. Spanskgrænn flötur, sem er endurtekinn í eldhúsi, innréttingu og baðherbergi, er þráðurinn sem gengur í gegn, og á móti honum standa dökkur viður, ljós steinn og terracotta á veggjum. Innbyggða veggeiningin í stofunni er lýst innan frá svo hún les sem hluti af húsinu frekar en húsgagn upp við vegg.',
      'Eldhúsið er opnað að stofunni með ljósri eyju og viðarborðplötu undir svörtu rimlalofti, og kaffihornið er falið í háum skáp sem lokast þegar hann er ekki í notkun.',
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
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Endurhönnun'], ['Staðsetning', 'Kópavogur']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'laugalaekur-fataherbergi',
    title: 'Laugalækur, fataherbergi',
    category: 'innanhusshonnun',
    oldPath: '/verkefni/innanhusshonnun/laugalaekur/',
    lead: 'Fataherbergi með baðkari í endanum, hugsað sem sérrými til að vera í friði.',
    body: [
      'Hér var gert fataherbergi með baðkari í endanum, sérstaklega hugsað sem rými þar sem hægt er að slappa af í friði og ró. Baðkarið stendur frítt á móti steinsteypuáferð á veggnum, með mjórri hillu fyrir kerti í brjósthæð og lýsingu sem er höfð lág.',
      'Sérsmíðin er það sem gerir rýmið. Skáparnir og fatastangirnar eru smíðaðar á staðinn, skórnir fá sína eigin lágu skúffueiningu undir stönginni, og lýsingin er felld inn í brautir í loftinu svo ekkert ljós lendir í augunum þegar staðið er við spegilinn.',
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
    lead: 'Stílhrein form, flotuð gólf með hita í, hlýr viður og grófur steinn.',
    body: [
      'Sumarhúsið er byggt á móti þrennu sem á að vinna saman frekar en að keppa: stílhrein form, flotuð gólf með hita í, og gróft efni þar sem það sést mest. Steinklæðningin gengur upp á fullan vegg og heldur sömu áferð úti við gluggann og inni í rýminu, svo húsið les eins úr báðum áttum.',
      'Þakið er látið standa opið með sýnilegum viðarbitum og furuklæðningu, og glergaflarnir opna stofuna út í landið á tvo vegu. Á móti steininum standa hlýr viður í hurðum og innréttingum og mjúk grá áklæði.',
      'Smáatriðin eru þar sem húsið verður persónulegt: glerkúluljós hangandi fyrir framan steinvegginn, birkiveggfóður á móti viðnum, og eldhúsbar með glerjum í opnum hillum.',
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
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Sumarhús'], ['Staðsetning', 'Ölfus']],
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
      P('p-freyja-0', 'Herbergi á Freyjugötu með djúpbláum vegg og ljósmynd af hestum'),
      P('p-freyja-1', 'Tveggja manna herbergi með bláum vegg og lömpum beggja vegna'),
      P('p-freyja-2', 'Setustofa með fjólubláum sófa og mynstruðum púðum'),
      P('p-freyja-4', 'Freyju-skiltið í steini og húsið að utan'),
      P('p-freyja-5', 'Gangur með ljósfjólubláum vegg og svart-hvítu flísagólfi'),
      P('p-freyja-3', 'Útsýni úr garðinum að Hallgrímskirkju að kvöldi'),
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
      P('p-freyjalux-0', 'Lúxusíbúðin við Freyju með sérsmíðaðri hillueiningu og tveimur rúmum'),
      P('p-freyjalux-1', 'Setustofa með fjólubláum sófa, sérsmíðaðri hillu og hengiljósi'),
      P('p-freyjalux-3', 'Snyrting með sexhyrndum flísum, lýstum sporöskjuspegli og dökkbláum dyrum'),
      P('p-freyjalux-4', 'Eldhúskrókur með vegglampa og útsýni út um gluggann'),
      P('p-freyjalux-2', 'Veggfóður og hengiljós í nærmynd'),
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
    photos: [
      P('p-svala-0', 'Spuni, verðlaunahesturinn, í mynd á grænum vegg í Svala Apartments'),
      P('p-svala-1', 'Tvö rúm með ryðrauðum púðum og gluggum út að Laugavegi'),
      P('p-svala-4', 'Svefnherbergi með svölum, ryðrauðum stólum og borði'),
      P('p-svala-2', 'Borðkrókur með dökkum gardínum og hengiljósi'),
      P('p-svala-3', 'Stigi undir súð með ljósmynd af hesti'),
    ],
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
    lead: 'Íbúð í eldra húsi þar sem upprunalegu smíðinni er haldið.',
    body: [
      'Verkefnið snerist um að endurnýja án þess að má út það sem gerir eldra hús eftirsótt. Timburbitarnir í loftinu eru látnir standa og svefnherbergið byggt undir þeim, frekar en að klæða yfir þá.',
      'Nýju hlutirnir eru hafðir hlutlausir svo það gamla sé það sem sést.',
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
    facts: [['Hlutverk', 'Innanhússhönnun íbúðar'], ['Gerð', 'Gistiíbúð í eldra húsi']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  {
    slug: 'hotel-hekla',
    title: 'Hótel Hekla',
    category: 'gistiheimili-og-hotel',
    oldPath: '/verkefni/gistiheimili-hotel/hotel-hekla/',
    lead: 'Ný álma, matsalur og bar í sveitinni, með fuglana og litina að utan teknar inn.',
    body: [
      'Verkefnið náði yfir hótelið allt: ný álma var hönnuð frá grunni þegar hún var tekin í notkun, og samhliða henni matsalurinn, barinn og eldri álman. Það þýðir að gestur gengur í gegnum eitt hús frekar en tvö, þótt byggingarnar séu frá sitthvorum tímanum.',
      'Náttúran fyrir utan er tekin inn og notuð sem efniviður frekar en skreyting. Fuglarnir koma fyrir í púðum, á ljósaskermum og í myndefni, og litirnir eru sóttir í landið: mosagrænt í matsalnum, mýkri blátóna í herbergjunum og einn heitur appelsínugulur flötur á baðherbergi.',
      'Herbergin sitja undir súð og eru hönnuð út frá því. Rúmgaflar eru bólstraðir svo hallandi loftið verði mjúkt frekar en þröngt, og hvert herbergi fær sitt eigið setuhorn við gluggann.',
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
    facts: [['Hlutverk', 'Ný álma, matsalur, bar og eldri álma'], ['Gerð', 'Hótel'], ['Staðsetning', 'Sveit']],
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
      P('p-skrifstofa-1', 'Skrifstofurými með opnu vinnusvæði, bókahillum og appelsínugulum barstólum'),
      P('p-skrifstofa-0', 'Setuhorn á skrifstofu með gráum sófa og terracotta stól'),
      P('p-skrifstofa-3', 'Fundarrými með plómurauðum veggjum, háu borði og pílukastspjaldi'),
      P('p-skrifstofa-5', 'Glerskilrúm með laufamynstri sem grafísk hönnun'),
      P('p-skrifstofa-4', 'Gangur með glerskilrúmum, gróðurkeri og teppi'),
      P('p-skrifstofa-6', 'Hurð og glerveggur með laufamynstri inn í fundarherbergi'),
      P('p-skrifstofa-7', 'Setustofa með fléttuljósi, sófa og gróðurmynstruðum vegg'),
      P('p-skrifstofa-2', 'Merking heilsuseturs á viðarvegg í móttöku'),
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
    facts: [['Hlutverk', 'Hönnun móttöku og biðstofu'], ['Staðsetning', 'Garðatorg, Garðabær'], ['Gerð', 'Heilbrigðisrými']],
  },

  /* ── Ýmislegt ────────────────────────────────────────────────────────── */
  {
    slug: 'stemning',
    title: 'Stemning',
    category: 'ymislegt',
    oldPath: '/verkefni/ymislegt/stemning/',
    lead: 'Það verður að vera gaman: augnablikin úr verkefnunum þar sem hönnunin leyfir sér mest.',
    body: [
      'Ekki er allt í einu verkefni jafn stórt. Sum ákvörðunin er heilt hús og önnur er einn stóll, einn litur eða einn spegill, og það eru oft þau smáatriði sem fólk man eftir að hafa gengið út.',
      'Hér er safn slíkra augnablika úr ólíkum verkefnum: rauður Egg-stóll á móti bláum chesterfield og sebrateppi, sexhyrndar flísar með lýstum kringlóttum spegli, spanskgrænn og korallrauður flötur hlið við hlið, og messingfuglar á hillu innan um litað gler.',
      'Þetta er ekki flokkur út af fyrir sig heldur það sem gerist þegar rými fær að vera skemmtilegt, frumlegt og sérstætt í stað þess að vera aðeins rétt.',
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
    facts: [['Hlutverk', 'Smáatriði úr ólíkum verkefnum'], ['Gerð', 'Stemningsmyndir']],
  },
]

export const PROJECT_COUNT = PROJECTS.length
export const PHOTOGRAPHED = PROJECTS.filter((p) => p.photos.length > 0)
export const byCategory = (c: CategorySlug) => PROJECTS.filter((p) => p.category === c)
export const bySlug = (s: string) => PROJECTS.find((p) => p.slug === s)
/** Only projects with photography get a page; a stub page ranks for nothing. */
export const hasPage = (p: Project) => p.photos.length > 0
