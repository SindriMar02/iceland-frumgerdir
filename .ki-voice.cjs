/* Rewrites every project's lead, body, facts and credit from Katrín's OWN
   words on katrinisfeld.is (fetched 2026-09-14, extracted to the scratchpad
   her-copy.txt), in her voice: first person, warm, her specifics. Nothing
   here is read off a photograph; where her page says little, the page says
   little. Also: the magazine is "Hús og híbýli", the homepage Súluhöfði
   summary, the studio page's invented rationale, and one FAQ line that
   claimed more than she wrote. Run once: node .ki-voice.cjs */
const fs = require('fs')
const K = 'src/preview/katrinisfeld/'

const P = {
  'nybyggt-hus-i-suluhofda': {
    lead: 'Öll innanhússhönnun í nýbyggingu, þar sem útsýnið fékk að njóta sín.',
    body: [
      'Húsið var í byggingu þegar ég fékk það verkefni að sjá um alla innanhússhönnunina. Það er alltaf gleðilegt að fá verkefni á þeim tíma sem enn er hægt að breyta innra skipulaginu, og það var aðeins gert hér.',
      'Lagt var upp með að láta fallega útsýnið frá gólfsíðu gluggunum njóta sín sem best. Eldhúsrýmið er hannað með innréttingum frá Arrital, og á eyjuna varð djúpur vínrauður litur fyrir valinu, á móti mjúkum og dekkri tón í háu innréttingunum. Í baðherbergjunum er sleginn svipaður litatónn, sem tónar vel við hreinlætistækin í mjúkum sandlit.',
      'Allar flísar koma frá Agli Árnasyni. Það kom einstaklega vel út að nota sömu flísar á gólfið í gegnum allt húsið og poppa þær upp með mynstraðri útgáfu í mjúkum lit á arninum og á veggþykkingu inni á baði. Hljóðdúkur er á móti viðarplönkum í breytilegum stærðum meðfram gluggunum í aðalrýminu, og lýsingin er hönnuð með rýminu, þar sem litlir kastarar vinna á móti stærri ljósum sem gefa mýkt og fyllingu.',
    ],
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Nýbygging'], ['Innréttingar', 'Arrital'], ['Flísar', 'Egill Árnason']],
  },
  'sumarhus-i-fljotshlidinni': {
    lead: 'Heildarhönnun að innan í sumarhúsi, nýtískulegt, hlýlegt og með góðu flæði.',
    body: [
      'Húsið var í byggingu þegar ég fékk verkefnið, og því gerði ég heildarhönnun á rýminu að innan. Leitað var eftir að hafa rýmið nýtískulegt, hlýlegt og með góðu flæði.',
      'Efnisvalið er gert út frá staðsetningunni og náttúrunni í kring. Litirnir eru mildir og náttúrulegir, viður er í loftinu að hluta á móti hljóðdúk, og fallegir koparlitaðir kastarar eru á móti meira áberandi hangandi ljósum.',
      'Við leyfðum okkur að poppa hönnunina aðeins upp með fallegum litum í veggflísunum á baðherbergjunum. Allar innréttingar eru frá Arrital á Ítalíu.',
    ],
    facts: [['Hlutverk', 'Heildarhönnun innanhúss'], ['Gerð', 'Sumarhús'], ['Staðsetning', 'Fljótshlíð'], ['Innréttingar', 'Arrital']],
  },
  'eldhusrymi-i-skuggahverfi': {
    lead: 'Lúxus eldhúsrými sem hæfir glæsiíbúð í Skuggahverfinu.',
    body: [
      'Glæsiíbúð í Skuggahverfinu fékk lúxus eldhúsrými sem hæfir íbúðinni. Falleg eik í grábrúnum og hlýjum lit fer vel á móti sandlituðum skápunum sem prýða eyjuna.',
      'Það er keramikplatan, sem minnir á gosösku, sem rammar þetta inn. LED lýsing á bak við fallegu glerskápana flæðir birtu niður keramikplötuna á veggnum og gerir skemmtilega stemningu, og vaskurinn er sérsmíðaður úr keramik og áfastur borðplötunni.',
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Staðsetning', 'Skuggahverfi, Reykjavík']],
  },
  'eldhusrymi-i-skandinaviskum-stil': {
    lead: 'Ljós eik, sandlitaðir skápar og keramikborðplata með svörtum vaski.',
    body: [
      'Glæsilegt eldhúsrými í fallegum skandinavískum stíl. Ljós eikin fer vel á móti sprautulökkuðum skápunum í ljósum sandlit.',
      'Keramikborðplatan með svarta vaskinum, sem er undirfelldur í plötuna, toppar þetta fallega eldhús. Veggir og loft eru máluð í sama lit og skáparnir.',
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Stíll', 'Skandinavískur']],
  },
  'eldhusrymi': {
    lead: 'Eldhúsið, hjarta heimilisins, hannað út frá þörfum fjölskyldunnar.',
    body: [
      'Stundum er talað um að eldhúsið sé hjarta heimilisins, og þess vegna er oft mikið lagt í þetta rými. Hönnun og útlit hvers eldhúsrýmis endurspeglar þarfir heimilisfólksins og hvernig rýmið umvefur hverja fjölskyldu með persónulegum stíl, fegurð og skipulagi.',
      'Þetta eldhús er í 112 Reykjavík og innréttingin er frá Arrital á Ítalíu.',
    ],
    facts: [['Hlutverk', 'Hönnun eldhúsrýmis'], ['Staðsetning', '112 Reykjavík'], ['Innréttingar', 'Arrital']],
    credit: 'Hallur Karlsson',
  },
  'alfheimar': {
    lead: 'Hæð í húsi eftir Sigvalda Thordarson, þar sem stíllinn frá 1970 fékk að halda sér.',
    body: [
      'Hæð í Sigvalda Thordarson húsi var tekin í gegn. Stíllinn frá 1970, þegar húsið var byggt, var látinn koma í gegn með nútímalegu ívafi.',
      'Litir á veggjum og flísar voru valin frá þessum tíma, og haldið var í fallegu tekkhurðirnar og stóra fataskápinn.',
    ],
    facts: [['Hlutverk', 'Endurhönnun hæðar'], ['Staðsetning', 'Álfheimar, Reykjavík']],
    credit: 'Eggert Jóhannesson',
  },
  'hus-i-gardabae': {
    lead: 'Eldhúsið opnað og látið fljóta saman við stofuna.',
    body: [
      'Þetta verkefni gekk út á að opna eldhúsrýmið og láta það fljóta saman við stofurýmið, og allir veggir í kringum eldhúsið voru teknir burt.',
      'Hljóðdúkur var settur í allt loftið til að koma í veg fyrir hljóðmengun í rýminu, innréttingar og húsgögn voru endurnýjuð og gestasalernið var einnig tekið í gegn.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun'], ['Staðsetning', 'Garðabær']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  'badherbergi': {
    lead: 'Sýnishorn úr nokkrum af þeim fjölmörgu baðherbergjum sem ég hef tekið í gegn.',
    body: [
      'Ég hef tekið í gegn fjölmörg baðherbergi, og hér eru sýnishorn úr nokkrum verkefnum.',
      'Meðal þeirra eru baðherbergi á Hávallagötu í 101 Reykjavík, við Lækjarás í 110 Reykjavík, í Baldursgarði í Keflavík og í Álfheimum í 105 Reykjavík.',
    ],
    facts: [['Hlutverk', 'Hönnun baðherbergja'], ['Staðsetning', 'Reykjavík og Keflavík']],
  },
  'barnaherbergi': {
    lead: 'Blágrænn litur á veggjum og lofti, og innréttingar sem heimilisfaðirinn smíðaði.',
    body: [
      'Hér var fallegur blágrænn litur notaður bæði á veggi og loft, og það kemur svo vel út því liturinn er umvefjandi og fallegur.',
      'Innréttingarnar eru einstaklega skemmtilegar og gerðar af heimilisföðurnum.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun barnaherbergis']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  'honnunar-studio': {
    lead: 'Stúdíóið þar sem innréttingarnar, litirnir og efnin eru til sýnis.',
    body: [
      'Katrín Ísfeld Hönnunar Studio tekur að sér innanhússhönnun heimila, fyrirtækja og gistirýma, bæði hótela og gistiheimila. Stúdíóið flytur einnig inn hágæða ítalskar innréttingar og er með einkaleyfi á innréttingunum frá Arrital, sem fást hér bæði teiknaðar og innfluttar.',
      'Hér starfa innanhússarkitektar og grafískur hönnuður, Ómar Örn Sigurðsson, sem kemur að þeim verkefnum þar sem aðkoma grafísks hönnuðar skiptir máli. Ómar er með yfir 20 ára reynslu í faginu og hefur komið að fjölda verkefna af öllum stærðargráðum.',
      'Í stúdíóinu má sjá hönnun á lýsingu, litum, merkingum á rúðum, speglum, gardínum og listaverkum, og flottu ítölsku innréttingarnar sem eiga stóran sess á gólfinu. Verið velkomin.',
    ],
    facts: [['Hlutverk', 'Eigið stúdíó og sýningarrými'], ['Staðsetning', 'Reykjavík']],
  },
  'fjallalind': {
    lead: 'Aðalhæðin tekin í gegn, opnuð í eitt rými og hljóðvistin leyst með hljóðdúk og trérimlum.',
    body: [
      'Aðalhæðin í húsinu var öll tekin í gegn. Stór veggur var tekinn út og eldhúsrýmið opnað inn í stofu og borðstofu, og forstofuveggirnir voru líka teknir, svo forstofan gengur nú inn með ganginum og inn í aðalrýmið.',
      'Til að ná fram góðri hljóðvist var hljóðdúkur settur í allt loftið og hljóðdempandi trérimlar notaðir, og því gátu stórar flísar farið á allt gólfið.',
      'Eldhúsinnréttingin og baðinnréttingin eru frá Arrital, og 12 mm þykkar keramikborðplötur fá að njóta sín bæði í eldhúsi og á baði. Samspil jarðlita og áferða einkennir verkefnið og skapar þægilega og rómantíska stemningu.',
    ],
    facts: [['Hlutverk', 'Öll innanhússhönnun aðalhæðar'], ['Gerð', 'Endurhönnun'], ['Áhersla', 'Hljóðvist og opið flæði'], ['Innréttingar', 'Arrital']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  'fallegt-hus-i-kopavogi': {
    lead: 'Stórkostlega vel hannað hús að utan, tekið allt í gegn að innan.',
    body: [
      'Húsið er stórkostlega vel hannað að utan, en kominn var tími til að taka það allt í gegn að innan, þannig að samhljómur yrði á milli utanhússhönnunarinnar og innanhússins.',
    ],
    facts: [['Hlutverk', 'Öll innanhússhönnun'], ['Gerð', 'Endurhönnun'], ['Staðsetning', 'Kópavogur']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  'laugalaekur-fataherbergi': {
    lead: 'Fataherbergi með baðkari í endanum, til að slappa af í friði og ró.',
    body: [
      'Hér var gert fataherbergi með baðkari í endanum, sérstaklega fyrir frúna á heimilinu til að fá að slappa af og vera í friði og ró.',
      'Sérsmíðin á skápum og fatastöngum kom einstaklega vel út.',
    ],
    facts: [['Hlutverk', 'Hönnun fataherbergis'], ['Gerð', 'Sérsmíði'], ['Staðsetning', 'Laugalækur, Reykjavík']],
  },
  'sumarhus-i-olfusi': {
    lead: 'Stílhrein form og flotuð gólf á móti hlýlegum við og grófum steini.',
    body: [
      'Sumarhús þar sem stíllinn er blanda af stílhreinum formum og flotuðum gólfum með hita í, á móti fallegum og hlýlegum við og grófum steini.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun'], ['Gerð', 'Sumarhús'], ['Staðsetning', 'Ölfus']],
  },
  'freyja-gistiheimili': {
    lead: 'Virðulegt hús á Freyjugötu, þar sem eigendurnir gáfu mér frjálsar hendur.',
    body: [
      'Mjög virðulegt og fallegt hús á Freyjugötu sem var mjög gaman að fá að vinna með. Falleg húsgögn í bland við gömul komu skemmtilega út, og ný baðherbergi og flottir litir fengu að njóta sín.',
      'Eigendurnir gáfu mér frjálsar hendur til að hanna, og þetta er útkoman.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiheimilis'], ['Gerð', 'Gistiheimili'], ['Staðsetning', 'Freyjugata, Reykjavík']],
  },
  'freyja-luxusibud': {
    lead: 'Lúxusíbúð í sérstakri einingu við Freyju gistiheimili, með sérsmíðuðum innréttingum.',
    body: [
      'Hér var gerð lúxusíbúð í sérstakri einingu við Freyju gistiheimili. Allar innréttingar eru sérsmíðaðar og mikið lagt upp úr því að gera íbúðina sem fallegasta, með tengingu við gistiheimilið.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun íbúðar'], ['Gerð', 'Lúxusíbúð'], ['Innréttingar', 'Sérsmíðaðar']],
  },
  'svala-apartments': {
    lead: 'Nýuppgerðar gistiíbúðir á Laugaveginum.',
    body: [
      'Nýuppgerðar gistiíbúðir á Laugaveginum, fallegar og vel útbúnar, með skemmtilegu útsýni, fallegum húsgögnum og myndum.',
      'Spuni, frægi verðlaunahesturinn, sómir sér vel þarna.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiíbúða'], ['Gerð', 'Gistiíbúðir'], ['Staðsetning', 'Laugavegur, Reykjavík']],
  },
  'solvallagata': {
    lead: 'Gullfallegt hús við Sólvallagötu, þar sem fallegu elementunum var haldið.',
    body: [
      'Gullfallegt hús við Sólvallagötu. Haldið var í fallegu elementin sem voru í húsinu og aðrir hlutir lagaðir.',
      'Kjallari hússins var endurhannaður og eldhúsi, baðaðstöðu og herbergjum komið vel fyrir. Fallegir litir og húsgögn gerðu svo lokahnykkinn.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiheimilis'], ['Staðsetning', 'Sólvallagata, Reykjavík']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  'old-charm-reykjavik-apartment': {
    lead: 'Fjögur gömul hús og átta gistiíbúðir, eitt af mínum uppáhaldsverkefnum.',
    body: [
      'Þetta verkefni er eitt af mínum uppáhalds, þar sem þetta eru fjögur hús og átta gistiíbúðir.',
      'Í gömlu húsunum lögðum við mikið í að halda og laga gömlu elementin sem voru fyrir og hanna skemmtilega í kringum þau. Litir og fallegar hugmyndir fengu að skína, og árangurinn var samkvæmt því.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun gistiíbúða'], ['Umfang', 'Fjögur hús og átta gistiíbúðir']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  'hotel-hekla': {
    lead: 'Ný álma, matsalur, bar og eldri álma, með náttúruna fyrir utan tekna inn í rýmið.',
    body: [
      'Yndislegt verkefni í sveitinni. Ég hannaði allt frá grunni í nýrri álmu við hótelið, sem tekin var í notkun, ásamt því að hanna matsalinn, barinn og eldri álmuna.',
      'Náttúran fyrir utan skilaði sér inn í rýmið með því að nota fuglana og litina.',
    ],
    facts: [['Hlutverk', 'Ný álma, matsalur, bar og eldri álma'], ['Gerð', 'Hótel']],
    credit: 'Rakel Ósk Sigurðardóttir',
  },
  'skrifstofurymi': {
    lead: 'Skemmtileg og fjölbreytt skrifstofurými, hönnuð í anda fyrirtækjanna sem þar starfa.',
    body: [
      'Hér má finna skrifstofurými sem eru skemmtileg og fjölbreytt. Það er gefandi og skemmtilegt að fá að hanna rýmin í anda þeirra fyrirtækja sem þar starfa.',
      'Þarfirnar eru misjafnar, en flest fyrirtækin sem ég hef hannað fyrir hafa haft þá sameiginlegu ósk að stíllinn sé hlýlegur og rýmið vel skipulagt, með góðu flæði og skemmtilegri hönnun sem tekið er eftir.',
      'Meðal verkefnanna eru skrifstofur Lánasjóðs sveitarfélaga, Samkennd Heilsusetur, Alfreð Atvinnuleit, Digido og Múr & Mál.',
    ],
    facts: [['Hlutverk', 'Hönnun skrifstofurýma'], ['Gerð', 'Atvinnuhúsnæði']],
  },
  'tannlaeknastofan-gardatorgi': {
    lead: 'Notaleg, afslappandi og falleg tannlæknastofa.',
    body: [
      'Tannlæknastofan á að vera notaleg, afslappandi og falleg, og veggfóðrið poppar skemmtilega upp rýmið.',
    ],
    facts: [['Hlutverk', 'Innanhússhönnun tannlæknastofu'], ['Staðsetning', 'Garðatorg, Garðabær'], ['Gerð', 'Heilbrigðisrými']],
  },
  'stemning': {
    lead: 'Það verður að vera gaman.',
    body: [
      'Hér er stemning í skemmtilegri hönnun sem gerir útkomu verkefnisins bæði skemmtilega, frumlega og sérstæða.',
    ],
    facts: [['Hlutverk', 'Stemning úr ólíkum verkefnum'], ['Gerð', 'Stemningsmyndir']],
  },
}

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
let src = fs.readFileSync(K + 'projects.ts', 'utf8')
const done = []
for (const [slug, v] of Object.entries(P)) {
  const start = src.indexOf(`    slug: '${slug}',`)
  if (start < 0) throw new Error(`project not found: ${slug}`)
  const end = src.indexOf('\n  },', start)
  let block = src.slice(start, end)
  const lead = /    lead: '(?:[^'\\]|\\.)*',/
  if (!lead.test(block)) throw new Error(`no lead: ${slug}`)
  block = block.replace(lead, `    lead: ${q(v.lead)},`)
  const body = /    body: \[[\s\S]*?\n    \],/
  if (!body.test(block)) throw new Error(`no body: ${slug}`)
  block = block.replace(body, `    body: [\n${v.body.map((b) => `      ${q(b)},`).join('\n')}\n    ],`)
  const factsLine = `    facts: [${v.facts.map(([k, x]) => `[${q(k)}, ${q(x)}]`).join(', ')}],`
  block = /\n    facts: \[.*\],/.test(block) ? block.replace(/    facts: \[.*\],/, factsLine) : block + '\n' + factsLine
  block = block.replace(/\n    credit: '(?:[^'\\]|\\.)*',/, '')
  if (v.credit) block = block.replace(factsLine, `${factsLine}\n    credit: ${q(v.credit)},`)
  src = src.slice(0, start) + block + src.slice(end)
  done.push(slug)
}
src = src.replace('/** Two or three short paragraphs. Grounded in the photographs. */', '/** Her own words from katrinisfeld.is, in her voice. Never read off a photograph. */')
fs.writeFileSync(K + 'projects.ts', src)

/* the rest of the site */
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8')
  for (const [a, b] of pairs) {
    const hit = typeof a === 'string' ? s.includes(a) : a.test(s)
    if (!hit) throw new Error(`${file}: not found ${a}`)
    s = typeof a === 'string' ? s.split(a).join(b) : s.replace(a, b)
  }
  fs.writeFileSync(file, s)
}
edit(K + 'press.ts', [['Hús og hýbýli', 'Hús og híbýli']])
edit(K + 'PressPage.tsx', [['Hús og hýbýli', 'Hús og híbýli']])
edit('tools/katrin-seo.mjs', [['Hús og hýbýli', 'Hús og híbýli']])
/* JSX and long string literals wrap across lines, so match any whitespace run */
const ws = (text) => new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+'))
edit(K + 'content.ts', [[ws('meðal annars móttöku og biðstofu Tannlæknastofunnar á Garðatorgi.'), 'meðal annars Tannlæknastofuna á Garðatorgi og Samkennd Heilsusetur.']])
edit(K + 'Home.tsx', [[ws('Eyjan er vínrauð, ljósin kopar og arinveggurinn ljós steinn með eldiviðarhólfum, allt teiknað inn í húsið frá grunni.'),
  'Djúpur vínrauður litur á Arrital eyjunni, flísar frá Agli Árnasyni í gegnum allt húsið\n            og lýsing sem er hönnuð með rýminu.']])
edit(K + 'StudioPage.tsx', [[ws('Sú reynsla, að vinna innanhússhönnun inni á arkitektastofu, er ástæðan fyrir því hvernig verkefnin eru tekin hér heima: rýmið er teiknað með húsinu en ekki lagt ofan á það þegar smíðinni er lokið.'),
  'Hún er innanhússhönnuðurinn sem lætur innréttingar, húsgögn og litasamsetningar spila rétt saman, með útkomu sem tekið er eftir.']])

console.log(`rewrote ${done.length} projects from her own copy; press, FAQ, homepage and studio lines updated`)
