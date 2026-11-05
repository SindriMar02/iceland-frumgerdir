import type { PreviewCompany } from '../company-types'
export type Lang = 'is' | 'en'
export interface Bi { is: string; en: string }
export const pick = (b: Bi, lang: Lang) => b[lang]
const BASE = import.meta.env.BASE_URL
export const img = (f: string) => `${BASE}exton/${f}.webp`
export const brand = (f: string) => `${BASE}exton/brand/${f}`
export const ROUTE_IS = `${BASE}preview/exton`
export const ROUTE_EN = `${BASE}preview/exton/en`
export const PHONE = { display: '575 4600', href: 'tel:+3545754600' }
export const MAIL = 'leiga@exton.is'
export const ADDRESS = 'Vesturvör 30c, 200 Kópavogur'
export const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Vesturvor+30c+Kopavogur'
export const SITE_URL = 'https://exton.is/'
export interface Fact { img: string; alt: Bi; stat: [Bi, Bi]; desc: Bi; pos?: string }
export interface LedgerCell { main: Bi; small?: Bi }
export interface LedgerRow { title: Bi; sub?: Bi; a: LedgerCell; b: LedgerCell; go: Bi; prefill: Record<string, string> }
export interface Collection {
  key: 'hljod' | 'svid' | 'tjold' | 'hljodfaeri'
  name: Bi; marquee: Bi; blurb: [Bi, Bi]
  description: Bi
  hero: string; heroAlt: Bi; cover: string
  slides: Array<{ f: string; alt: Bi }>
  lead: Bi; chip: Bi; galleryTitle: Bi; galleryText: Bi
  quoteImg: string; quote: Bi; quoteSource: Bi
  breaks: [{ f: string; alt: Bi }, { f: string; alt: Bi }]
  labels: [Bi, Bi]
  facts: Fact[]
  pull?: Bi
  cta: Bi; ctaPrefill: Record<string, string>
  ledgerTitle: Bi; ledgerHead: [Bi, Bi, Bi]; ledgerNote: Bi
  rows: LedgerRow[]
  source: string
  card: { from: Bi; range: Bi; service: Bi }
}


export const COLLECTIONS: Collection[] = [
  {
    "key": "hljod",
    "name": {
      "is": "Hljóðkerfi",
      "en": "Sound"
    },
    "marquee": {
      "is": "Hljóðkerfi",
      "en": "Sound"
    },
    "blurb": [
      {
        "is": "Til leigu",
        "en": "For hire"
      },
      {
        "is": "Pakkar frá RCF, NEXO og Meyer",
        "en": "Packages from RCF, NEXO and Meyer"
      }
    ],
    "description": {
      "is": "Hljóðkerfi fyrir ræður, veislur og tónleika. Leigðu búnaðinn eða fáðu tæknimenn Exton til að setja upp, stjórna og taka niður.",
      "en": "Sound systems for speeches, parties and concerts. Hire the equipment or have Exton technicians set up, operate and take it down."
    },
    "hero": "sound",
    "heroAlt": {
      "is": "Hátalarar og sviðslýsing á mynd Exton",
      "en": "Speakers and stage lighting in an Exton photograph"
    },
    "cover": "rcf2",
    "slides": [
      {
        "f": "rcf1",
        "alt": {
          "is": "RCF pakki 1 með tveimur hátölurum, mixer og hljóðnema",
          "en": "RCF package 1 with two speakers, mixer and microphone"
        }
      },
      {
        "f": "evox1",
        "alt": {
          "is": "RCF Evox J9 og J9mix með hljóðnemum",
          "en": "RCF Evox J9 and J9mix with microphones"
        }
      },
      {
        "f": "meyer",
        "alt": {
          "is": "Meyer hljóðkerfapakki með mixer og hljóðnemum",
          "en": "Meyer sound package with mixer and microphones"
        }
      },
      {
        "f": "nexo",
        "alt": {
          "is": "NEXO hljóðkerfapakki með hátölurum og bassaboxum",
          "en": "NEXO sound package with speakers and subwoofers"
        }
      }
    ],
    "lead": {
      "is": "Hljóðkerfi fyrir ræður, veislur og tónleika.",
      "en": "Sound systems for speeches, parties and concerts."
    },
    "chip": {
      "is": "Verð á fyrirspurn",
      "en": "Price on request"
    },
    "galleryTitle": {
      "is": "Hljóðkerfi til leigu",
      "en": "Sound for hire"
    },
    "galleryText": {
      "is": "Leigðu búnaðinn eða fáðu tæknimenn Exton til að setja upp, stjórna og taka niður.",
      "en": "Hire the equipment or have Exton technicians set up, operate and take it down."
    },
    "quoteImg": "rcf2",
    "quote": {
      "is": "Pakkar frá RCF, NEXO og Meyer",
      "en": "Packages from RCF, NEXO and Meyer"
    },
    "quoteSource": {
      "is": "Úrval Exton",
      "en": "Exton range"
    },
    "breaks": [
      {
        "f": "sound",
        "alt": {
          "is": "Hátalarar og sviðslýsing á mynd Exton",
          "en": "Speakers and stage lighting in an Exton photograph"
        }
      },
      {
        "f": "nexo",
        "alt": {
          "is": "NEXO hljóðkerfapakki með hátölurum og bassaboxum",
          "en": "NEXO sound package with speakers and subwoofers"
        }
      }
    ],
    "labels": [
      {
        "is": "Hljóðkerfi",
        "en": "Sound"
      },
      {
        "is": "Hljóðkerfi",
        "en": "Sound"
      }
    ],
    "facts": [
      {
        "img": "rcf1",
        "alt": {
          "is": "RCF pakki 1 með tveimur hátölurum, mixer og hljóðnema",
          "en": "RCF package 1 with two speakers, mixer and microphone"
        },
        "stat": [
          {
            "is": "RCF pakki 1",
            "en": "RCF package 1"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "2 × RCF 932, mixer, 1 hljóðnemi á standi, kaplar og fylgihlutir",
          "en": "2 × RCF 932, mixer, 1 microphone on stand, cables and accessories"
        }
      },
      {
        "img": "rcf2",
        "alt": {
          "is": "RCF pakki 2 með hátölurum, bassaboxum og hljóðnemum",
          "en": "RCF package 2 with speakers, subwoofers and microphones"
        },
        "stat": [
          {
            "is": "RCF pakki 2",
            "en": "RCF package 2"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "2 × RCF 932, 2 × RCF 905, mixer, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
          "en": "2 × RCF 932, 2 × RCF 905, mixer, 2 microphones on stands, cables and accessories"
        }
      }
    ],
    "cta": {
      "is": "Fyrirspurn um hljóðkerfi",
      "en": "Enquire about sound"
    },
    "ctaPrefill": {
      "product": "rcf1"
    },
    "ledgerTitle": {
      "is": "Úrval og upplýsingar",
      "en": "Range and specifications"
    },
    "ledgerHead": [
      {
        "is": "Búnaður",
        "en": "Equipment"
      },
      {
        "is": "Stærð og innihald",
        "en": "Size and components"
      },
      {
        "is": "Verð",
        "en": "Price"
      }
    ],
    "ledgerNote": {
      "is": "Veldu búnað og hann fylgir með í beiðnina. Starfsfólk staðfestir framboð og verð.",
      "en": "Select equipment to include it in your request. Staff confirm availability and price."
    },
    "rows": [
      {
        "title": {
          "is": "RCF pakki 1",
          "en": "RCF package 1"
        },
        "sub": {
          "is": "Ræðuhöld í heimahúsi eða litlum sal",
          "en": "Speeches at home or in a small hall"
        },
        "a": {
          "main": {
            "is": "2 × RCF 932, mixer, 1 hljóðnemi á standi, kaplar og fylgihlutir",
            "en": "2 × RCF 932, mixer, 1 microphone on stand, cables and accessories"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "rcf1"
        }
      },
      {
        "title": {
          "is": "RCF pakki 2",
          "en": "RCF package 2"
        },
        "sub": {
          "is": "Veisla í heimahúsi eða litlum sal",
          "en": "A party at home or in a small hall"
        },
        "a": {
          "main": {
            "is": "2 × RCF 932, 2 × RCF 905, mixer, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
            "en": "2 × RCF 932, 2 × RCF 905, mixer, 2 microphones on stands, cables and accessories"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "rcf2"
        }
      },
      {
        "title": {
          "is": "EVOX pakki 1",
          "en": "EVOX package 1"
        },
        "sub": {
          "is": "Veisla í heimahúsi eða litlum sal",
          "en": "A party at home or in a small hall"
        },
        "a": {
          "main": {
            "is": "RCF Evox J9 og J9mix, innbyggður 4 rása mixer með Bluetooth, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
            "en": "RCF Evox J9 and J9mix, built-in 4-channel mixer with Bluetooth, 2 microphones on stands, cables and accessories"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "evox1"
        }
      },
      {
        "title": {
          "is": "EVOX pakki 2",
          "en": "EVOX package 2"
        },
        "sub": {
          "is": "Veisla í heimahúsi eða meðalstórum sal",
          "en": "A party at home or in a medium-sized hall"
        },
        "a": {
          "main": {
            "is": "RCF Evox J11 og J11mix, innbyggður 4 rása mixer með Bluetooth, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
            "en": "RCF Evox J11 and J11mix, built-in 4-channel mixer with Bluetooth, 2 microphones on stands, cables and accessories"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "evox2"
        }
      },
      {
        "title": {
          "is": "NEXO pakki 1",
          "en": "NEXO package 1"
        },
        "sub": {
          "is": "Stærra garðpartý eða stór salur",
          "en": "A larger garden party or a large hall"
        },
        "a": {
          "main": {
            "is": "2 × NEXO PS15r2, 2 × NEXO LS18, Nexo magnari, mixer, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
            "en": "2 × NEXO PS15r2, 2 × NEXO LS18, Nexo amplifier, mixer, 2 microphones on stands, cables and accessories"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "nexo"
        }
      },
      {
        "title": {
          "is": "MEYER pakki 1",
          "en": "MEYER package 1"
        },
        "sub": {
          "is": "Veisla með hljómsveit eða stærri atriði",
          "en": "A party with a band or a larger performance"
        },
        "a": {
          "main": {
            "is": "2 × Meyer X40, 2 × Meyer 900lfc, Allen & Heath SQ/QU mixer, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
            "en": "2 × Meyer X40, 2 × Meyer 900lfc, Allen & Heath SQ/QU mixer, 2 microphones on stands, cables and accessories"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "meyer"
        }
      }
    ],
    "source": "https://exton.is/leiga/hljodkerfi-til-leigu/",
    "card": {
      "from": {
        "is": "Verð á fyrirspurn",
        "en": "Price on request"
      },
      "range": {
        "is": "Pakkar frá RCF, NEXO og Meyer",
        "en": "Packages from RCF, NEXO and Meyer"
      },
      "service": {
        "is": "Leiga og þjónusta",
        "en": "Hire and service"
      }
    }
  },
  {
    "key": "svid",
    "name": {
      "is": "Svið",
      "en": "Stages"
    },
    "marquee": {
      "is": "Svið",
      "en": "Stages"
    },
    "blurb": [
      {
        "is": "Til leigu",
        "en": "For hire"
      },
      {
        "is": "48 og 80 m² undir þaki",
        "en": "48 and 80 m² under a roof"
      }
    ],
    "description": {
      "is": "Sviðspallar og sviðsvagnar. Frá litlum sviðspöllum upp í risasvið. Sviðsvagnarnir fást án búnaðar eða með hljóði og ljósum.",
      "en": "Stage decks and stage trailers. From small stage decks to a large stage. Stage trailers are available without equipment or with sound and lighting."
    },
    "hero": "stage",
    "heroAlt": {
      "is": "Hljómsveit á upplýstu sviði",
      "en": "A band on an illuminated stage"
    },
    "cover": "stage",
    "slides": [
      {
        "f": "stage8",
        "alt": {
          "is": "FREESTAGE 8 × 6 m sviðsvagn undir þaki",
          "en": "Roofed FREESTAGE 8 × 6 m stage trailer"
        }
      },
      {
        "f": "stage10",
        "alt": {
          "is": "FREESTAGE 10 × 8 m sviðsvagn undir þaki",
          "en": "Roofed FREESTAGE 10 × 8 m stage trailer"
        }
      },
      {
        "f": "deck",
        "alt": {
          "is": "Svartur sviðspallur með álramma",
          "en": "A black stage deck with an aluminium frame"
        }
      }
    ],
    "lead": {
      "is": "Sviðspallar og sviðsvagnar.",
      "en": "Stage decks and stage trailers."
    },
    "chip": {
      "is": "Verð á fyrirspurn",
      "en": "Price on request"
    },
    "galleryTitle": {
      "is": "Svið til leigu",
      "en": "Stages for hire"
    },
    "galleryText": {
      "is": "Frá litlum sviðspöllum upp í risasvið. Sviðsvagnarnir fást án búnaðar eða með hljóði og ljósum.",
      "en": "From small stage decks to a large stage. Stage trailers are available without equipment or with sound and lighting."
    },
    "quoteImg": "stage",
    "quote": {
      "is": "48 og 80 m² undir þaki",
      "en": "48 and 80 m² under a roof"
    },
    "quoteSource": {
      "is": "Úrval Exton",
      "en": "Exton range"
    },
    "breaks": [
      {
        "f": "stage",
        "alt": {
          "is": "Hljómsveit á upplýstu sviði",
          "en": "A band on an illuminated stage"
        }
      },
      {
        "f": "deck",
        "alt": {
          "is": "Svartur sviðspallur með álramma",
          "en": "A black stage deck with an aluminium frame"
        }
      }
    ],
    "labels": [
      {
        "is": "Svið",
        "en": "Stages"
      },
      {
        "is": "Svið",
        "en": "Stages"
      }
    ],
    "facts": [
      {
        "img": "stage8",
        "alt": {
          "is": "FREESTAGE 8 × 6 m sviðsvagn undir þaki",
          "en": "Roofed FREESTAGE 8 × 6 m stage trailer"
        },
        "stat": [
          {
            "is": "FREESTAGE 8 × 6 m",
            "en": "FREESTAGE 8 × 6 m"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "48 m² undir þaki. Stækkanlegt með pöllum.",
          "en": "48 m² under a roof. Extendable with stage decks."
        }
      },
      {
        "img": "stage10",
        "alt": {
          "is": "FREESTAGE 10 × 8 m sviðsvagn undir þaki",
          "en": "Roofed FREESTAGE 10 × 8 m stage trailer"
        },
        "stat": [
          {
            "is": "FREESTAGE 10 × 8 m",
            "en": "FREESTAGE 10 × 8 m"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "80 m² undir þaki. Stækkanlegt með pöllum.",
          "en": "80 m² under a roof. Extendable with stage decks."
        }
      }
    ],
    "cta": {
      "is": "Fyrirspurn um svið",
      "en": "Enquire about stages"
    },
    "ctaPrefill": {
      "product": "stage8"
    },
    "ledgerTitle": {
      "is": "Úrval og upplýsingar",
      "en": "Range and specifications"
    },
    "ledgerHead": [
      {
        "is": "Búnaður",
        "en": "Equipment"
      },
      {
        "is": "Stærð og innihald",
        "en": "Size and components"
      },
      {
        "is": "Verð",
        "en": "Price"
      }
    ],
    "ledgerNote": {
      "is": "Veldu búnað og hann fylgir með í beiðnina. Starfsfólk staðfestir framboð og verð.",
      "en": "Select equipment to include it in your request. Staff confirm availability and price."
    },
    "rows": [
      {
        "title": {
          "is": "FREESTAGE 8 × 6 m",
          "en": "FREESTAGE 8 × 6 m"
        },
        "sub": {
          "is": "Innbyggður lyftubúnaður fyrir hljóð og ljós",
          "en": "Built-in lifting equipment for sound and lighting"
        },
        "a": {
          "main": {
            "is": "48 m² undir þaki. Stækkanlegt með pöllum.",
            "en": "48 m² under a roof. Extendable with stage decks."
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "stage8"
        }
      },
      {
        "title": {
          "is": "FREESTAGE 10 × 8 m",
          "en": "FREESTAGE 10 × 8 m"
        },
        "sub": {
          "is": "Innbyggður lyftubúnaður fyrir hljóð og ljós",
          "en": "Built-in lifting equipment for sound and lighting"
        },
        "a": {
          "main": {
            "is": "80 m² undir þaki. Stækkanlegt með pöllum.",
            "en": "80 m² under a roof. Extendable with stage decks."
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "stage10"
        }
      },
      {
        "title": {
          "is": "Sviðspallar",
          "en": "Stage decks"
        },
        "sub": {
          "is": "Útfærsla eftir viðburði",
          "en": "Configured for the event"
        },
        "a": {
          "main": {
            "is": "Sveigjanlegt flatarmál og hæð",
            "en": "Flexible area and height"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "deck"
        }
      },
      {
        "title": {
          "is": "SEE LITE risasvið",
          "en": "SEE LITE large stage"
        },
        "sub": {
          "is": "Tónlistarhátíðir og stórtónleikar",
          "en": "Music festivals and large concerts"
        },
        "a": {
          "main": {
            "is": "Tæknileg útfærsla í samvinnu við skipuleggjendur",
            "en": "Technical configuration with the organisers"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "seelite"
        }
      }
    ],
    "source": "https://exton.is/leiga/svid-og-svidsvagnar-til-leigu/",
    "card": {
      "from": {
        "is": "Verð á fyrirspurn",
        "en": "Price on request"
      },
      "range": {
        "is": "48 og 80 m² undir þaki",
        "en": "48 and 80 m² under a roof"
      },
      "service": {
        "is": "Leiga og þjónusta",
        "en": "Hire and service"
      }
    }
  },
  {
    "key": "tjold",
    "name": {
      "is": "Veislutjöld",
      "en": "Tents"
    },
    "marquee": {
      "is": "Veislutjöld",
      "en": "Tents"
    },
    "blurb": [
      {
        "is": "Til leigu",
        "en": "For hire"
      },
      {
        "is": "6 til 144 m²",
        "en": "6 to 144 m²"
      }
    ],
    "description": {
      "is": "Veislutjöld í stærðum frá 6 til 144 m². Tjöldin fást án þjónustu eða með flutningi, uppsetningu og niðurtekt. Veldu stærð og leigudaga í beiðninni.",
      "en": "Event tents from 6 to 144 m². Tents are available without service or with transport, set-up and removal. Choose the size and hire dates in the request."
    },
    "hero": "party",
    "heroAlt": {
      "is": "Svið og ljósabúnaður inni í veislutjaldi",
      "en": "A stage and lighting equipment inside an event tent"
    },
    "cover": "tent6",
    "slides": [
      {
        "f": "tent6",
        "alt": {
          "is": "Hvítt R6 veislutjald með gluggum á grasi",
          "en": "A white R6 event tent with windows on grass"
        }
      },
      {
        "f": "tent8",
        "alt": {
          "is": "Hvítt R8 veislutjald á útisvæði",
          "en": "A white R8 event tent outdoors"
        }
      },
      {
        "f": "top",
        "alt": {
          "is": "Hvítt topptjald með bogadregnum gluggum",
          "en": "A white pagoda tent with arched windows"
        }
      },
      {
        "f": "gala",
        "alt": {
          "is": "Hvítt Gala pop-up tjald",
          "en": "A white Gala pop-up tent"
        }
      }
    ],
    "lead": {
      "is": "Veislutjöld í stærðum frá 6 til 144 m².",
      "en": "Event tents from 6 to 144 m²."
    },
    "chip": {
      "is": "Verð á fyrirspurn",
      "en": "Price on request"
    },
    "galleryTitle": {
      "is": "Veislutjöld til leigu",
      "en": "Tents for hire"
    },
    "galleryText": {
      "is": "Tjöldin fást án þjónustu eða með flutningi, uppsetningu og niðurtekt. Veldu stærð og leigudaga í beiðninni.",
      "en": "Tents are available without service or with transport, set-up and removal. Choose the size and hire dates in the request."
    },
    "quoteImg": "tent6",
    "quote": {
      "is": "6 til 144 m²",
      "en": "6 to 144 m²"
    },
    "quoteSource": {
      "is": "Úrval Exton",
      "en": "Exton range"
    },
    "breaks": [
      {
        "f": "party",
        "alt": {
          "is": "Svið og ljósabúnaður inni í veislutjaldi",
          "en": "A stage and lighting equipment inside an event tent"
        }
      },
      {
        "f": "gala",
        "alt": {
          "is": "Hvítt Gala pop-up tjald",
          "en": "A white Gala pop-up tent"
        }
      }
    ],
    "labels": [
      {
        "is": "Veislutjöld",
        "en": "Tents"
      },
      {
        "is": "Veislutjöld",
        "en": "Tents"
      }
    ],
    "facts": [
      {
        "img": "tent6",
        "alt": {
          "is": "Hvítt R6 veislutjald með gluggum á grasi",
          "en": "A white R6 event tent with windows on grass"
        },
        "stat": [
          {
            "is": "R6 · 6 × 6 m",
            "en": "R6 · 6 × 6 m"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "36 m² · Álgrind með hvítum plastdúk",
          "en": "36 m² · Aluminium frame with white cover"
        }
      },
      {
        "img": "tent6",
        "alt": {
          "is": "Hvítt R6 veislutjald með gluggum á grasi",
          "en": "A white R6 event tent with windows on grass"
        },
        "stat": [
          {
            "is": "R6 · 9 × 6 m",
            "en": "R6 · 9 × 6 m"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "54 m² · Álgrind með hvítum plastdúk",
          "en": "54 m² · Aluminium frame with white cover"
        }
      }
    ],
    "cta": {
      "is": "Fyrirspurn um veislutjöld",
      "en": "Enquire about tents"
    },
    "ctaPrefill": {
      "product": "r6-36"
    },
    "ledgerTitle": {
      "is": "Úrval og upplýsingar",
      "en": "Range and specifications"
    },
    "ledgerHead": [
      {
        "is": "Búnaður",
        "en": "Equipment"
      },
      {
        "is": "Stærð og innihald",
        "en": "Size and components"
      },
      {
        "is": "Verð",
        "en": "Price"
      }
    ],
    "ledgerNote": {
      "is": "Stærð og leigudagar eru þegar hluti af tjaldafyrirspurn Exton. Gestafjöldi er áætlaður. R8 96 m² hefur misvísandi gestafjölda á vef Exton og þarfnast staðfestingar.",
      "en": "Size and hire dates are already part of Exton’s tent enquiry. Guest capacities are approximate. Exton’s website gives conflicting capacities for R8 96 m², so confirmation is needed."
    },
    "rows": [
      {
        "title": {
          "is": "R6 · 6 × 6 m",
          "en": "R6 · 6 × 6 m"
        },
        "sub": {
          "is": "Um 30-50 manns",
          "en": "Approx. 30-50 guests"
        },
        "a": {
          "main": {
            "is": "36 m² · Álgrind með hvítum plastdúk",
            "en": "36 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r6-36"
        }
      },
      {
        "title": {
          "is": "R6 · 9 × 6 m",
          "en": "R6 · 9 × 6 m"
        },
        "sub": {
          "is": "Um 40-80 manns",
          "en": "Approx. 40-80 guests"
        },
        "a": {
          "main": {
            "is": "54 m² · Álgrind með hvítum plastdúk",
            "en": "54 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r6-54"
        }
      },
      {
        "title": {
          "is": "R6 · 12 × 6 m",
          "en": "R6 · 12 × 6 m"
        },
        "sub": {
          "is": "Um 70-100 manns",
          "en": "Approx. 70-100 guests"
        },
        "a": {
          "main": {
            "is": "72 m² · Álgrind með hvítum plastdúk",
            "en": "72 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r6-72"
        }
      },
      {
        "title": {
          "is": "R6 · 15 × 6 m",
          "en": "R6 · 15 × 6 m"
        },
        "sub": {
          "is": "Um 80-140 manns",
          "en": "Approx. 80-140 guests"
        },
        "a": {
          "main": {
            "is": "90 m² · Álgrind með hvítum plastdúk",
            "en": "90 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r6-90"
        }
      },
      {
        "title": {
          "is": "R8 · 6 × 8 m",
          "en": "R8 · 6 × 8 m"
        },
        "sub": {
          "is": "Um 35-70 manns",
          "en": "Approx. 35-70 guests"
        },
        "a": {
          "main": {
            "is": "48 m² · Álgrind með hvítum plastdúk",
            "en": "48 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r8-48"
        }
      },
      {
        "title": {
          "is": "R8 · 9 × 8 m",
          "en": "R8 · 9 × 8 m"
        },
        "sub": {
          "is": "Um 70-100 manns",
          "en": "Approx. 70-100 guests"
        },
        "a": {
          "main": {
            "is": "72 m² · Álgrind með hvítum plastdúk",
            "en": "72 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r8-72"
        }
      },
      {
        "title": {
          "is": "R8 · 12 × 8 m",
          "en": "R8 · 12 × 8 m"
        },
        "sub": {
          "is": "Gestafjöldi þarfnast staðfestingar",
          "en": "Guest capacity requires confirmation"
        },
        "a": {
          "main": {
            "is": "96 m² · Álgrind með hvítum plastdúk",
            "en": "96 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r8-96"
        }
      },
      {
        "title": {
          "is": "R8 · 15 × 8 m",
          "en": "R8 · 15 × 8 m"
        },
        "sub": {
          "is": "Um 120-200 manns",
          "en": "Approx. 120-200 guests"
        },
        "a": {
          "main": {
            "is": "120 m² · Álgrind með hvítum plastdúk",
            "en": "120 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r8-120"
        }
      },
      {
        "title": {
          "is": "R8 · 18 × 8 m",
          "en": "R8 · 18 × 8 m"
        },
        "sub": {
          "is": "Um 150-250 manns",
          "en": "Approx. 150-250 guests"
        },
        "a": {
          "main": {
            "is": "144 m² · Álgrind með hvítum plastdúk",
            "en": "144 m² · Aluminium frame with white cover"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "r8-144"
        }
      },
      {
        "title": {
          "is": "Topptjald · 4 × 4 m",
          "en": "Pagoda tent · 4 × 4 m"
        },
        "sub": {
          "is": "Hægt að tengja fleiri tjöld saman",
          "en": "Several tents can be joined"
        },
        "a": {
          "main": {
            "is": "16 m²",
            "en": "16 m²"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "top16"
        }
      },
      {
        "title": {
          "is": "Topptjald · 5 × 5 m",
          "en": "Pagoda tent · 5 × 5 m"
        },
        "sub": {
          "is": "Hægt að tengja fleiri tjöld saman",
          "en": "Several tents can be joined"
        },
        "a": {
          "main": {
            "is": "25 m²",
            "en": "25 m²"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "top25"
        }
      },
      {
        "title": {
          "is": "Gala 20 · 2 × 3 m",
          "en": "Gala 20 · 2 × 3 m"
        },
        "sub": {
          "is": "Þak eitt og sér eða valdar hliðar lokaðar",
          "en": "Roof only or selected sides closed"
        },
        "a": {
          "main": {
            "is": "6 m²",
            "en": "6 m²"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "gala20"
        }
      },
      {
        "title": {
          "is": "Gala 30 · 3 × 3 m",
          "en": "Gala 30 · 3 × 3 m"
        },
        "sub": {
          "is": "Þak eitt og sér eða valdar hliðar lokaðar",
          "en": "Roof only or selected sides closed"
        },
        "a": {
          "main": {
            "is": "9 m²",
            "en": "9 m²"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "gala30"
        }
      },
      {
        "title": {
          "is": "Gala 45 · 3 × 4,5 m",
          "en": "Gala 45 · 3 × 4.5 m"
        },
        "sub": {
          "is": "Þak eitt og sér eða valdar hliðar lokaðar",
          "en": "Roof only or selected sides closed"
        },
        "a": {
          "main": {
            "is": "13,5 m²",
            "en": "13.5 m²"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "gala45"
        }
      }
    ],
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "card": {
      "from": {
        "is": "Verð á fyrirspurn",
        "en": "Price on request"
      },
      "range": {
        "is": "6 til 144 m²",
        "en": "6 to 144 m²"
      },
      "service": {
        "is": "Leiga og þjónusta",
        "en": "Hire and service"
      }
    }
  },
  {
    "key": "hljodfaeri",
    "name": {
      "is": "Hljóðfæri",
      "en": "Instruments"
    },
    "marquee": {
      "is": "Hljóðfæri",
      "en": "Instruments"
    },
    "blurb": [
      {
        "is": "Til leigu",
        "en": "For hire"
      },
      {
        "is": "Trommur, magnarar og hljómborð",
        "en": "Drums, amplifiers and keyboards"
      }
    ],
    "description": {
      "is": "Hljóðfæri og magnarar til leigu. Trommusett, gítar- og bassamagnarar og hljómborð. Hljóðfæraleigan er rekin í samvinnu við Berg Geirsson og Silla Geirdal.",
      "en": "Instruments and amplifiers for hire. Drum kits, guitar and bass amplifiers and keyboards. The instrument hire operation is run with Berg Geirsson and Silli Geirdal."
    },
    "hero": "instruments",
    "heroAlt": {
      "is": "Hljóðfæri úr myndasafni hljóðfæraleigu Exton",
      "en": "Instruments from the Exton hire image library"
    },
    "cover": "guitars",
    "slides": [
      {
        "f": "drums",
        "alt": {
          "is": "Yamaha trommusett úr myndasafni Exton",
          "en": "A Yamaha drum kit from Exton’s image library"
        }
      },
      {
        "f": "keys",
        "alt": {
          "is": "Rautt Nord hljómborð",
          "en": "A red Nord keyboard"
        }
      },
      {
        "f": "ampeg",
        "alt": {
          "is": "Ampeg bassamagnari",
          "en": "An Ampeg bass amplifier"
        }
      },
      {
        "f": "guitars",
        "alt": {
          "is": "Rafmagnsgítar við magnara",
          "en": "An electric guitar beside amplifiers"
        }
      }
    ],
    "lead": {
      "is": "Hljóðfæri og magnarar til leigu.",
      "en": "Instruments and amplifiers for hire."
    },
    "chip": {
      "is": "Verð á fyrirspurn",
      "en": "Price on request"
    },
    "galleryTitle": {
      "is": "Hljóðfæri til leigu",
      "en": "Instruments for hire"
    },
    "galleryText": {
      "is": "Trommusett, gítar- og bassamagnarar og hljómborð. Hljóðfæraleigan er rekin í samvinnu við Berg Geirsson og Silla Geirdal.",
      "en": "Drum kits, guitar and bass amplifiers and keyboards. The instrument hire operation is run with Berg Geirsson and Silli Geirdal."
    },
    "quoteImg": "guitars",
    "quote": {
      "is": "Trommur, magnarar og hljómborð",
      "en": "Drums, amplifiers and keyboards"
    },
    "quoteSource": {
      "is": "Úrval Exton",
      "en": "Exton range"
    },
    "breaks": [
      {
        "f": "instruments",
        "alt": {
          "is": "Hljóðfæri úr myndasafni hljóðfæraleigu Exton",
          "en": "Instruments from the Exton hire image library"
        }
      },
      {
        "f": "guitars",
        "alt": {
          "is": "Rafmagnsgítar við magnara",
          "en": "An electric guitar beside amplifiers"
        }
      }
    ],
    "labels": [
      {
        "is": "Hljóðfæri",
        "en": "Instruments"
      },
      {
        "is": "Hljóðfæri",
        "en": "Instruments"
      }
    ],
    "facts": [
      {
        "img": "drums",
        "alt": {
          "is": "Yamaha trommusett úr myndasafni Exton",
          "en": "A Yamaha drum kit from Exton’s image library"
        },
        "stat": [
          {
            "is": "Trommusett",
            "en": "Drum kits"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "Yamaha, Tama, C&C, DW, Gretsch, Ludwig, Sonor og Pearl",
          "en": "Yamaha, Tama, C&C, DW, Gretsch, Ludwig, Sonor and Pearl"
        }
      },
      {
        "img": "guitars",
        "alt": {
          "is": "Rafmagnsgítar við magnara",
          "en": "An electric guitar beside amplifiers"
        },
        "stat": [
          {
            "is": "Gítarmagnarar",
            "en": "Guitar amplifiers"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "Marshall, Fender, Vox, Orange, Peavey, Roland, Supro og HiWatt",
          "en": "Marshall, Fender, Vox, Orange, Peavey, Roland, Supro and HiWatt"
        }
      },
      {
        "img": "ampeg",
        "alt": {
          "is": "Ampeg bassamagnari",
          "en": "An Ampeg bass amplifier"
        },
        "stat": [
          {
            "is": "Bassamagnarar",
            "en": "Bass amplifiers"
          },
          {
            "is": "Til leigu",
            "en": "For hire"
          }
        ],
        "desc": {
          "is": "Ampeg, Fender, Gallien Krueger og Ashdown",
          "en": "Ampeg, Fender, Gallien Krueger and Ashdown"
        }
      }
    ],
    "cta": {
      "is": "Fyrirspurn um hljóðfæri",
      "en": "Enquire about instruments"
    },
    "ctaPrefill": {
      "product": "drums"
    },
    "ledgerTitle": {
      "is": "Úrval og upplýsingar",
      "en": "Range and specifications"
    },
    "ledgerHead": [
      {
        "is": "Búnaður",
        "en": "Equipment"
      },
      {
        "is": "Stærð og innihald",
        "en": "Size and components"
      },
      {
        "is": "Verð",
        "en": "Price"
      }
    ],
    "ledgerNote": {
      "is": "Veldu búnað og hann fylgir með í beiðnina. Starfsfólk staðfestir framboð og verð.",
      "en": "Select equipment to include it in your request. Staff confirm availability and price."
    },
    "rows": [
      {
        "title": {
          "is": "Trommusett",
          "en": "Drum kits"
        },
        "sub": {
          "is": "Tilgreindu óskir um gerð í beiðni",
          "en": "Specify your preferred model in the request"
        },
        "a": {
          "main": {
            "is": "Yamaha, Tama, C&C, DW, Gretsch, Ludwig, Sonor og Pearl",
            "en": "Yamaha, Tama, C&C, DW, Gretsch, Ludwig, Sonor and Pearl"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "drums"
        }
      },
      {
        "title": {
          "is": "Gítarmagnarar",
          "en": "Guitar amplifiers"
        },
        "sub": {
          "is": "Tilgreindu óskir um gerð í beiðni",
          "en": "Specify your preferred model in the request"
        },
        "a": {
          "main": {
            "is": "Marshall, Fender, Vox, Orange, Peavey, Roland, Supro og HiWatt",
            "en": "Marshall, Fender, Vox, Orange, Peavey, Roland, Supro and HiWatt"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "guitaramp"
        }
      },
      {
        "title": {
          "is": "Bassamagnarar",
          "en": "Bass amplifiers"
        },
        "sub": {
          "is": "Tilgreindu óskir um gerð í beiðni",
          "en": "Specify your preferred model in the request"
        },
        "a": {
          "main": {
            "is": "Ampeg, Fender, Gallien Krueger og Ashdown",
            "en": "Ampeg, Fender, Gallien Krueger and Ashdown"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "bassamp"
        }
      },
      {
        "title": {
          "is": "Hljómborð",
          "en": "Keyboards"
        },
        "sub": {
          "is": "Tilgreindu óskir um gerð í beiðni",
          "en": "Specify your preferred model in the request"
        },
        "a": {
          "main": {
            "is": "Korg, Yamaha, Nord, Roland, Fender Rhodes, Wurlitzer og Hammond",
            "en": "Korg, Yamaha, Nord, Roland, Fender Rhodes, Wurlitzer and Hammond"
          }
        },
        "b": {
          "main": {
            "is": "Verð á fyrirspurn",
            "en": "Price on request"
          }
        },
        "go": {
          "is": "Velja",
          "en": "Select"
        },
        "prefill": {
          "product": "keys"
        }
      }
    ],
    "source": "https://exton.is/leiga/hljodfaeri-til-leigu/",
    "card": {
      "from": {
        "is": "Verð á fyrirspurn",
        "en": "Price on request"
      },
      "range": {
        "is": "Trommur, magnarar og hljómborð",
        "en": "Drums, amplifiers and keyboards"
      },
      "service": {
        "is": "Leiga og þjónusta",
        "en": "Hire and service"
      }
    }
  }
]
export const PRODUCTS = [
  {
    "key": "rcf1",
    "cat": "hljod",
    "label": {
      "is": "RCF pakki 1",
      "en": "RCF package 1"
    },
    "spec": {
      "is": "2 × RCF 932, mixer, 1 hljóðnemi á standi, kaplar og fylgihlutir",
      "en": "2 × RCF 932, mixer, 1 microphone on stand, cables and accessories"
    },
    "coverage": {
      "is": "Ræðuhöld í heimahúsi eða litlum sal",
      "en": "Speeches at home or in a small hall"
    },
    "source": "https://exton.is/leiga/hljodkerfi-til-leigu/rcf-hljodkerfapakki-1-til-leigu/",
    "image": "rcf1"
  },
  {
    "key": "rcf2",
    "cat": "hljod",
    "label": {
      "is": "RCF pakki 2",
      "en": "RCF package 2"
    },
    "spec": {
      "is": "2 × RCF 932, 2 × RCF 905, mixer, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
      "en": "2 × RCF 932, 2 × RCF 905, mixer, 2 microphones on stands, cables and accessories"
    },
    "coverage": {
      "is": "Veisla í heimahúsi eða litlum sal",
      "en": "A party at home or in a small hall"
    },
    "source": "https://exton.is/leiga/hljodkerfi-til-leigu/rcf-hljodkerfapakki-2-til-leigu/",
    "image": "rcf2"
  },
  {
    "key": "evox1",
    "cat": "hljod",
    "label": {
      "is": "EVOX pakki 1",
      "en": "EVOX package 1"
    },
    "spec": {
      "is": "RCF Evox J9 og J9mix, innbyggður 4 rása mixer með Bluetooth, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
      "en": "RCF Evox J9 and J9mix, built-in 4-channel mixer with Bluetooth, 2 microphones on stands, cables and accessories"
    },
    "coverage": {
      "is": "Veisla í heimahúsi eða litlum sal",
      "en": "A party at home or in a small hall"
    },
    "source": "https://exton.is/leiga/hljodkerfi-til-leigu/evox-hljodkerfapakki-1-til-leigu/",
    "image": "evox1"
  },
  {
    "key": "evox2",
    "cat": "hljod",
    "label": {
      "is": "EVOX pakki 2",
      "en": "EVOX package 2"
    },
    "spec": {
      "is": "RCF Evox J11 og J11mix, innbyggður 4 rása mixer með Bluetooth, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
      "en": "RCF Evox J11 and J11mix, built-in 4-channel mixer with Bluetooth, 2 microphones on stands, cables and accessories"
    },
    "coverage": {
      "is": "Veisla í heimahúsi eða meðalstórum sal",
      "en": "A party at home or in a medium-sized hall"
    },
    "source": "https://exton.is/leiga/hljodkerfi-til-leigu/evox-hljodkerfapakki-2-til-leigu/",
    "image": "evox2"
  },
  {
    "key": "nexo",
    "cat": "hljod",
    "label": {
      "is": "NEXO pakki 1",
      "en": "NEXO package 1"
    },
    "spec": {
      "is": "2 × NEXO PS15r2, 2 × NEXO LS18, Nexo magnari, mixer, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
      "en": "2 × NEXO PS15r2, 2 × NEXO LS18, Nexo amplifier, mixer, 2 microphones on stands, cables and accessories"
    },
    "coverage": {
      "is": "Stærra garðpartý eða stór salur",
      "en": "A larger garden party or a large hall"
    },
    "source": "https://exton.is/leiga/hljodkerfi-til-leigu/nexo-hljodkerfapakki-1-til-leigu/",
    "image": "nexo"
  },
  {
    "key": "meyer",
    "cat": "hljod",
    "label": {
      "is": "MEYER pakki 1",
      "en": "MEYER package 1"
    },
    "spec": {
      "is": "2 × Meyer X40, 2 × Meyer 900lfc, Allen & Heath SQ/QU mixer, 2 hljóðnemar á stöndum, kaplar og fylgihlutir",
      "en": "2 × Meyer X40, 2 × Meyer 900lfc, Allen & Heath SQ/QU mixer, 2 microphones on stands, cables and accessories"
    },
    "coverage": {
      "is": "Veisla með hljómsveit eða stærri atriði",
      "en": "A party with a band or a larger performance"
    },
    "source": "https://exton.is/leiga/hljodkerfi-til-leigu/meyer-hljodkerfapakki-1-til-leigu/",
    "image": "meyer"
  },
  {
    "key": "stage8",
    "cat": "svid",
    "label": {
      "is": "FREESTAGE 8 × 6 m",
      "en": "FREESTAGE 8 × 6 m"
    },
    "spec": {
      "is": "48 m² undir þaki. Stækkanlegt með pöllum.",
      "en": "48 m² under a roof. Extendable with stage decks."
    },
    "coverage": {
      "is": "Innbyggður lyftubúnaður fyrir hljóð og ljós",
      "en": "Built-in lifting equipment for sound and lighting"
    },
    "source": "https://exton.is/leiga/svid-og-svidsvagnar-til-leigu/svidsvagn-8x6m-til-leigu/",
    "image": "stage8"
  },
  {
    "key": "stage10",
    "cat": "svid",
    "label": {
      "is": "FREESTAGE 10 × 8 m",
      "en": "FREESTAGE 10 × 8 m"
    },
    "spec": {
      "is": "80 m² undir þaki. Stækkanlegt með pöllum.",
      "en": "80 m² under a roof. Extendable with stage decks."
    },
    "coverage": {
      "is": "Innbyggður lyftubúnaður fyrir hljóð og ljós",
      "en": "Built-in lifting equipment for sound and lighting"
    },
    "source": "https://exton.is/leiga/svid-og-svidsvagnar-til-leigu/svidsvagn-10x8m-til-leigu/",
    "image": "stage10"
  },
  {
    "key": "deck",
    "cat": "svid",
    "label": {
      "is": "Sviðspallar",
      "en": "Stage decks"
    },
    "spec": {
      "is": "Sveigjanlegt flatarmál og hæð",
      "en": "Flexible area and height"
    },
    "coverage": {
      "is": "Útfærsla eftir viðburði",
      "en": "Configured for the event"
    },
    "source": "https://exton.is/leiga/svid-og-svidsvagnar-til-leigu/",
    "image": "deck"
  },
  {
    "key": "seelite",
    "cat": "svid",
    "label": {
      "is": "SEE LITE risasvið",
      "en": "SEE LITE large stage"
    },
    "spec": {
      "is": "Tæknileg útfærsla í samvinnu við skipuleggjendur",
      "en": "Technical configuration with the organisers"
    },
    "coverage": {
      "is": "Tónlistarhátíðir og stórtónleikar",
      "en": "Music festivals and large concerts"
    },
    "source": "https://exton.is/leiga/svid-og-svidsvagnar-til-leigu/",
    "image": "stage"
  },
  {
    "key": "r6-36",
    "cat": "tjold",
    "label": {
      "is": "R6 · 6 × 6 m",
      "en": "R6 · 6 × 6 m"
    },
    "spec": {
      "is": "36 m² · Álgrind með hvítum plastdúk",
      "en": "36 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 30-50 manns",
      "en": "Approx. 30-50 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent6"
  },
  {
    "key": "r6-54",
    "cat": "tjold",
    "label": {
      "is": "R6 · 9 × 6 m",
      "en": "R6 · 9 × 6 m"
    },
    "spec": {
      "is": "54 m² · Álgrind með hvítum plastdúk",
      "en": "54 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 40-80 manns",
      "en": "Approx. 40-80 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent6"
  },
  {
    "key": "r6-72",
    "cat": "tjold",
    "label": {
      "is": "R6 · 12 × 6 m",
      "en": "R6 · 12 × 6 m"
    },
    "spec": {
      "is": "72 m² · Álgrind með hvítum plastdúk",
      "en": "72 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 70-100 manns",
      "en": "Approx. 70-100 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent6"
  },
  {
    "key": "r6-90",
    "cat": "tjold",
    "label": {
      "is": "R6 · 15 × 6 m",
      "en": "R6 · 15 × 6 m"
    },
    "spec": {
      "is": "90 m² · Álgrind með hvítum plastdúk",
      "en": "90 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 80-140 manns",
      "en": "Approx. 80-140 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent6"
  },
  {
    "key": "r8-48",
    "cat": "tjold",
    "label": {
      "is": "R8 · 6 × 8 m",
      "en": "R8 · 6 × 8 m"
    },
    "spec": {
      "is": "48 m² · Álgrind með hvítum plastdúk",
      "en": "48 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 35-70 manns",
      "en": "Approx. 35-70 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent8"
  },
  {
    "key": "r8-72",
    "cat": "tjold",
    "label": {
      "is": "R8 · 9 × 8 m",
      "en": "R8 · 9 × 8 m"
    },
    "spec": {
      "is": "72 m² · Álgrind með hvítum plastdúk",
      "en": "72 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 70-100 manns",
      "en": "Approx. 70-100 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent8"
  },
  {
    "key": "r8-96",
    "cat": "tjold",
    "label": {
      "is": "R8 · 12 × 8 m",
      "en": "R8 · 12 × 8 m"
    },
    "spec": {
      "is": "96 m² · Álgrind með hvítum plastdúk",
      "en": "96 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Gestafjöldi þarfnast staðfestingar",
      "en": "Guest capacity requires confirmation"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent8"
  },
  {
    "key": "r8-120",
    "cat": "tjold",
    "label": {
      "is": "R8 · 15 × 8 m",
      "en": "R8 · 15 × 8 m"
    },
    "spec": {
      "is": "120 m² · Álgrind með hvítum plastdúk",
      "en": "120 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 120-200 manns",
      "en": "Approx. 120-200 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent8"
  },
  {
    "key": "r8-144",
    "cat": "tjold",
    "label": {
      "is": "R8 · 18 × 8 m",
      "en": "R8 · 18 × 8 m"
    },
    "spec": {
      "is": "144 m² · Álgrind með hvítum plastdúk",
      "en": "144 m² · Aluminium frame with white cover"
    },
    "coverage": {
      "is": "Um 150-250 manns",
      "en": "Approx. 150-250 guests"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "tent8"
  },
  {
    "key": "top16",
    "cat": "tjold",
    "label": {
      "is": "Topptjald · 4 × 4 m",
      "en": "Pagoda tent · 4 × 4 m"
    },
    "spec": {
      "is": "16 m²",
      "en": "16 m²"
    },
    "coverage": {
      "is": "Hægt að tengja fleiri tjöld saman",
      "en": "Several tents can be joined"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "top"
  },
  {
    "key": "top25",
    "cat": "tjold",
    "label": {
      "is": "Topptjald · 5 × 5 m",
      "en": "Pagoda tent · 5 × 5 m"
    },
    "spec": {
      "is": "25 m²",
      "en": "25 m²"
    },
    "coverage": {
      "is": "Hægt að tengja fleiri tjöld saman",
      "en": "Several tents can be joined"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "top"
  },
  {
    "key": "gala20",
    "cat": "tjold",
    "label": {
      "is": "Gala 20 · 2 × 3 m",
      "en": "Gala 20 · 2 × 3 m"
    },
    "spec": {
      "is": "6 m²",
      "en": "6 m²"
    },
    "coverage": {
      "is": "Þak eitt og sér eða valdar hliðar lokaðar",
      "en": "Roof only or selected sides closed"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "gala"
  },
  {
    "key": "gala30",
    "cat": "tjold",
    "label": {
      "is": "Gala 30 · 3 × 3 m",
      "en": "Gala 30 · 3 × 3 m"
    },
    "spec": {
      "is": "9 m²",
      "en": "9 m²"
    },
    "coverage": {
      "is": "Þak eitt og sér eða valdar hliðar lokaðar",
      "en": "Roof only or selected sides closed"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "gala"
  },
  {
    "key": "gala45",
    "cat": "tjold",
    "label": {
      "is": "Gala 45 · 3 × 4,5 m",
      "en": "Gala 45 · 3 × 4.5 m"
    },
    "spec": {
      "is": "13,5 m²",
      "en": "13.5 m²"
    },
    "coverage": {
      "is": "Þak eitt og sér eða valdar hliðar lokaðar",
      "en": "Roof only or selected sides closed"
    },
    "source": "https://exton.is/leiga/tjaldaleiga/",
    "image": "gala"
  },
  {
    "key": "drums",
    "cat": "hljodfaeri",
    "label": {
      "is": "Trommusett",
      "en": "Drum kits"
    },
    "spec": {
      "is": "Yamaha, Tama, C&C, DW, Gretsch, Ludwig, Sonor og Pearl",
      "en": "Yamaha, Tama, C&C, DW, Gretsch, Ludwig, Sonor and Pearl"
    },
    "coverage": {
      "is": "Tilgreindu óskir um gerð í beiðni",
      "en": "Specify your preferred model in the request"
    },
    "source": "https://exton.is/leiga/hljodfaeri-til-leigu/",
    "image": "drums"
  },
  {
    "key": "guitaramp",
    "cat": "hljodfaeri",
    "label": {
      "is": "Gítarmagnarar",
      "en": "Guitar amplifiers"
    },
    "spec": {
      "is": "Marshall, Fender, Vox, Orange, Peavey, Roland, Supro og HiWatt",
      "en": "Marshall, Fender, Vox, Orange, Peavey, Roland, Supro and HiWatt"
    },
    "coverage": {
      "is": "Tilgreindu óskir um gerð í beiðni",
      "en": "Specify your preferred model in the request"
    },
    "source": "https://exton.is/leiga/hljodfaeri-til-leigu/",
    "image": "guitars"
  },
  {
    "key": "bassamp",
    "cat": "hljodfaeri",
    "label": {
      "is": "Bassamagnarar",
      "en": "Bass amplifiers"
    },
    "spec": {
      "is": "Ampeg, Fender, Gallien Krueger og Ashdown",
      "en": "Ampeg, Fender, Gallien Krueger and Ashdown"
    },
    "coverage": {
      "is": "Tilgreindu óskir um gerð í beiðni",
      "en": "Specify your preferred model in the request"
    },
    "source": "https://exton.is/leiga/hljodfaeri-til-leigu/",
    "image": "ampeg"
  },
  {
    "key": "keys",
    "cat": "hljodfaeri",
    "label": {
      "is": "Hljómborð",
      "en": "Keyboards"
    },
    "spec": {
      "is": "Korg, Yamaha, Nord, Roland, Fender Rhodes, Wurlitzer og Hammond",
      "en": "Korg, Yamaha, Nord, Roland, Fender Rhodes, Wurlitzer and Hammond"
    },
    "coverage": {
      "is": "Tilgreindu óskir um gerð í beiðni",
      "en": "Specify your preferred model in the request"
    },
    "source": "https://exton.is/leiga/hljodfaeri-til-leigu/",
    "image": "keys"
  }
]
export const OTHER_RENTALS = [{"name": {"is": "Ljósabúnaður", "en": "Lighting"}, "url": "https://exton.is/leiga/ljosabunadur-til-leigu/"}, {"name": {"is": "Streymisbúnaður", "en": "Streaming equipment"}, "url": "https://exton.is/leiga/streymisbunadur-til-leigu/"}, {"name": {"is": "Veislubúnaður", "en": "Party furniture"}, "url": "https://exton.is/leiga/veislubunadur-til-leigu/"}, {"name": {"is": "Hoppukastalar", "en": "Inflatables"}, "url": "https://exton.is/leiga/hoppukastalar-til-leigu/"}]
export const PILLARS: Fact[] = [{"img": "sound", "alt": {"is": "Hátalarar og sviðslýsing á mynd Exton", "en": "Speakers and stage lighting in an Exton photograph"}, "stat": [{"is": "Hljóðkerfi", "en": "Sound"}, {"is": "og þjónusta", "en": "and service"}], "desc": {"is": "Leigðu búnaðinn eða fáðu tæknimenn Exton til að setja upp, stjórna og taka niður.", "en": "Hire the equipment or have Exton technicians set up, operate and take it down."}}, {"img": "stage", "alt": {"is": "Hljómsveit á upplýstu sviði", "en": "A band on an illuminated stage"}, "stat": [{"is": "Svið", "en": "Stages"}, {"is": "og þjónusta", "en": "and service"}], "desc": {"is": "Frá litlum sviðspöllum upp í risasvið. Sviðsvagnarnir fást án búnaðar eða með hljóði og ljósum.", "en": "From small stage decks to a large stage. Stage trailers are available without equipment or with sound and lighting."}}, {"img": "party", "alt": {"is": "Svið og ljósabúnaður inni í veislutjaldi", "en": "A stage and lighting equipment inside an event tent"}, "stat": [{"is": "Veislutjöld", "en": "Tents"}, {"is": "og þjónusta", "en": "and service"}], "desc": {"is": "Tjöldin fást án þjónustu eða með flutningi, uppsetningu og niðurtekt. Veldu stærð og leigudaga í beiðninni.", "en": "Tents are available without service or with transport, set-up and removal. Choose the size and hire dates in the request."}}]

/* 2026-11-04: the story page is introduced instead of arriving as a surprise */
export const STORY: Record<Lang, { label: string; title: string; text: string; open: string; quote: string; chaptersAria: string; chapters: string[]; heroLine: string; heroLabel: string; teamAlt: string; teamCap: string; towerAlt: string; towerCap: string; hallAlt: string }> = {
  is: {
    label: '(Kynning)',
    title: 'Kynning á Exton',
    text: 'Stutt kynning á því sem Exton býður: hljóðið, sviðin og tjöldin, starfsstöðvarnar og fólkið sem setur búnaðinn upp. Fjórir hlutar og þú ræður hraðanum.',
    open: 'Opna kynninguna',
    quote: 'Fá tilboð strax',
    chaptersAria: 'Hlutar kynningarinnar',
    chapters: ['Fyrirtækið', 'Leiga og þjónusta', 'Starfsstöðvar', 'Leigusvið'],
    heroLabel: '(Kynning)',
    heroLine: 'Kynning á Exton í fjórum hlutum. Skrunaðu, eða farðu beint í hluta.',
    teamAlt: 'Starfsfólk Exton í treyjum í vöruhúsi, með flutningskassa og hillur í bakgrunni',
    teamCap: 'Starfsfólk Exton á treyjudeginum 2026.',
    towerAlt: 'Turninn í Kópavogi lýstur í bláum, fjólubláum og gulum litum í ljósaskiptunum',
    towerCap: 'Turninn í Kópavogi með Vivalyte-lýsingu. Exton er umboðs- og þjónustuaðili Vivalyte á Íslandi.',
    hallAlt: 'Stór veislusalur með setnum gestum og sviðslýsingu',
  },
  en: {
    label: '(Presentation)',
    title: 'Introducing Exton',
    text: 'A short presentation of what Exton offers: sound, stages and tents, the branches and the people who set the equipment up. Four parts, at your own pace.',
    open: 'Open the presentation',
    quote: 'Get a quote now',
    chaptersAria: 'Parts of the presentation',
    chapters: ['The company', 'Hire and service', 'Branches', 'Hire team'],
    heroLabel: '(Presentation)',
    heroLine: 'Exton in four parts. Scroll on, or jump straight to a part.',
    teamAlt: 'Exton staff in football shirts in a warehouse, with flight cases and shelving behind them',
    teamCap: 'Exton staff on Jersey Day 2026.',
    towerAlt: 'The Kópavogur tower lit in blue, purple and yellow at dusk',
    towerCap: 'The Kópavogur tower with Vivalyte lighting. Exton is the Vivalyte distributor and service partner in Iceland.',
    hallAlt: 'A large banquet hall with seated guests and stage lighting',
  },
}

export const T: Record<Lang, Record<string, string>> = {
  "is": {
    "htmlLang": "is",
    "skip": "Fara í efni",
    "brand": "Exton leiga, forsíða",
    "logoAlt": "Exton",
    "about": "Um Exton",
    "contact": "Fá tilboð",
    "home": "Forsíða",
    "forSale": "Til leigu",
    "forSaleAria": "Búnaður til leigu",
    "menuLabel": "Valmynd",
    "menuCloseLabel": "Loka",
    "menuOpen": "Opna valmynd",
    "menuClose": "Loka valmynd",
    "nav": "Aðalvalmynd",
    "navPrimary": "Síður",
    "requests": "Beiðnir, sýnishorn",
    "phoneLabel": "Sími",
    "langSwitch": "English",
    "pickerAria": "Veldu búnaðarflokk",
    "homeTile": "Leigan",
    "homeTileBlurb": "Búnaður og tæknifólk",
    "scrollHint": "(Skrunaðu)",
    "scroll": "Skruna",
    "next": "Næst",
    "play": "Spila",
    "stop": "Stöðva",
    "close": "Loka",
    "colophon": "Exton ehf. · Kópavogur · Akureyri",
    "homeLead": "Frá afmæli til tónleika.",
    "homeTitle": "Exton leiga | Hljóð, svið, tjöld og hljóðfæri",
    "homeDesc": "Hljóðkerfi, svið, veislutjöld og hljóðfæri til leigu hjá Exton. Veldu búnað eða þjónustu með tæknifólki. Kópavogur og Akureyri.",
    "chipNote": "Framboð og verð eru staðfest í tilboði.",
    "creditPre": "Designed by",
    "creditAria": "Designed by SNDR Studio",
    "protoNote": "Frumgerð af leiguvef Exton. Ekkert er sent og enginn búnaður tekinn frá.",
    "nextLabel": "Næsti flokkur",
    "ctaLink": "Setja saman beiðni",
    "aboutTitle": "Um Exton | Leiga og þjónusta",
    "aboutDesc": "Exton leigir út viðburðabúnað með eða án mannskaps. Starfsstöðvar í Kópavogi og á Akureyri þjónusta alla landshluta.",
    "aboutMarquee": "Exton",
    "aboutLabel": "(Fyrirtækið)",
    "aboutH1": "Leiga og tæknifólk hjá Exton",
    "aboutStatementLead": "Exton",
    "aboutStatement": "leigir út búnað með eða án mannskaps. Starfsfólkið býr að reynslu úr leikhúsum, viðburðum, tónleikum og sjónvarpi.",
    "aboutFilmAlt": "Tónleikar með sviðslýsingu og hljóðkerfi",
    "aboutFilmLink": "Lesa um fyrirtækið á exton.is",
    "aboutQuote": "Hljóð, ljós og mynd fyrir viðburðinn.",
    "aboutQuoteAlt": "Hljóðblöndunarborð úr myndasafni Exton",
    "aboutMarquee2": "Þjónusta",
    "aboutLabel2": "(Leiga og þjónusta)",
    "aboutValuesLead": "Tæknifólk Exton",
    "aboutValues": "setur upp búnað, stjórnar honum á viðburðinum og tekur hann niður að honum loknum.",
    "aboutLabel3": "(Starfsstöðvar)",
    "aboutHistoryLead": "Kópavogur og Akureyri.",
    "aboutHistory": "Exton þjónustar alla landshluta. Veldu starfsstöð í beiðninni og lýstu staðsetningu viðburðarins.",
    "aboutLabel4": "(Leigusvið)",
    "pillars": "(01)|(02)|(03)|(04)",
    "aboutCta": "Skoðaðu búnaðinn.",
    "aboutCtaLink": "Hljóðkerfi til leigu",
    "aboutBreak": "Svið á útitónleikum úr myndasafni Exton",
    "contactTitle": "Fá tilboð | Exton leiga",
    "contactDesc": "Veldu leigu á búnaði eða viðburð með mannskap. Skráðu búnað, dagsetningar og staðsetningu í staðbundið yfirlit. Frumgerð, ekkert sent.",
    "contactWord": "Fyrirspurn",
    "contactH1": "Fyrirspurn um leigu eða viðburð",
    "contactHeading": "Búnaður, staður og tími.",
    "chOffice": "Sími leigunnar",
    "chMail": "Netfang leigunnar",
    "chHours": "Starfsstöðvar",
    "hoursText": "Vesturvör 30c, Kópavogur · Goðanes 4, Akureyri",
    "copyDone": "Netfang afritað",
    "copyAria": "Afrita netfangið ",
    "tabRental": "LEIGA",
    "tabJob": "VIÐBURÐUR",
    "tabsAria": "Tegund fyrirspurnar",
    "fName": "Nafn *",
    "fEmail": "Netfang *",
    "fPhone": "Sími *",
    "fCompany": "Fyrirtæki",
    "fProduct": "Búnaður eða tjaldstærð *",
    "fQty": "Magn *",
    "fFrom": "Leigja frá *",
    "fTo": "Leigja til *",
    "fPickup": "Sótt á starfsstöð *",
    "fMessage": "Nánari lýsing og óskir",
    "fAddress": "Viðburðarstaður og heimilisfang *",
    "fStart": "Dagsetning viðburðar *",
    "fPhotos": "Myndir af viðburðarstað",
    "hintRental": "Ég sæki búnaðinn og nota hann sjálf/ur. Starfsfólk staðfestir framboð og verð.",
    "hintSize": "Áætluð stærð og gestafjöldi duga í fyrstu fyrirspurn.",
    "hintPhotos": "Valfrjálst. Myndirnar haldast í vafranum og eru ekki sendar. Þú getur líka lýst staðnum í texta.",
    "consent": "Ég skil að þetta er staðbundið yfirlit í frumgerð. ",
    "consentLink": "Um upplýsingarnar",
    "consentTail": ".",
    "send": "Skoða yfirlit",
    "sending": "Útbý yfirlit…",
    "phonePh": "Sími",
    "phoneNeeded": "Skráðu símanúmer.",
    "formError": "Athugaðu nauðsynlega reiti. Ekkert var sent.",
    "sampleForm": "Frumgerð. Ekkert er sent, vistað á netþjón eða tekið frá. * Nauðsynlegir reitir.",
    "thanksTitle": "Yfirlit beiðni",
    "thanksText": "Yfirlitið er aðeins í þessum vafra.",
    "thanksNote": "Ekkert var sent. Til að fá tilboð má hafa samband við leiga@exton.is eða 575 4600.",
    "thanksMore": "Til baka í beiðni",
    "thanksRental": "LEIGA · Ég sæki og nota búnaðinn.",
    "thanksJob": "VIÐBURÐUR · Flutningur, uppsetning, stjórn og niðurtekt með Exton.",
    "policyTitle": "Upplýsingar í frumgerðinni",
    "policy": "<p>Upplýsingarnar eru aðeins notaðar til að sýna yfirlit í vafranum. Ekkert er sent til Exton eða SNDR Studio og ekkert er vistað á netþjón. Myndir fara ekki úr tækinu.</p><p>Við endurhleðslu eða þegar þú yfirgefur beiðnina hverfa upplýsingarnar. Frumgerðin staðfestir hvorki verð né framboð.</p>",
    "notFoundTitle": "Síða fannst ekki | Exton",
    "notFoundDesc": "Þessi síða er ekki í leigufrumgerð Exton. Farðu á yfirlit búnaðar eða settu saman fyrirspurn.",
    "notFoundWord": "404",
    "notFoundHeading": "Síða fannst ekki.",
    "chExplore": "Búnaður",
    "chBack": "Á forsíðu leigunnar",
    "chHelp": "Fyrirspurn",
    "chContactUs": "Setja saman beiðni",
    "notFoundText": "Skoðaðu búnaðinn á forsíðunni eða byrjaðu á fyrirspurn um viðburðinn.",
    "ovTitle": "Beiðnir, dæmigögn | Exton",
    "ovDesc": "Sýnishorn af skipulögðum leigubeiðnum. Búnaður, magn, tími, staður, starfsstöð og upplýsingar sem vantar. Allar færslur eru tilbúin dæmi.",
    "ovMarquee": "Beiðnir",
    "ovLabel": "(Sýnishorn)",
    "ovH1": "Beiðnir, sýnishorn fyrir starfsfólk",
    "ovLead": "Yfirlit beiðna.",
    "ovStatement": "Búnaður, magn, dagsetningar og staður í einni færslu. Opnaðu dæmi til að sjá viðhengi og upplýsingar sem vantar.",
    "ovNoticeTag": "Dæmigögn",
    "ovNotice": "Allar færslur eru tilbúin dæmi. Þær koma ekki frá Exton eða viðskiptavinum fyrirtækisins.",
    "ovInboxTitle": "Fyrirspurnir",
    "ovInboxSub": "Veldu færslu til að sjá nánar.",
    "ovCol1": "Tegund",
    "ovCol2": "Búnaður",
    "ovCol3": "Staður",
    "ovCol4": "Tími",
    "ovCol5": "Starfsstöð",
    "ovCol6": "Staða",
    "ovCta": "Settu saman þína beiðni.",
    "ovCtaLink": "Opna fyrirspurn",
    "ovBreak": "Tónleikasvið úr myndasafni Exton",
    "homeSub": "Hljóðkerfi, svið, veislutjöld og hljóðfæri. Leigðu búnaðinn eða fáðu Exton til að sjá um tæknina á viðburðinum.",
    "homeCtaEnquire": "Fá tilboð",
    "homeCtaSale": "Skoða búnað",
    "factsAria": "Leigan í stuttu máli",
    "factFrom": "starfsstöðvar",
    "factHeight": "stærðir veislutjalda",
    "factHoist": "þakið svið á vögnum",
    "factFounded": "búnaður og tæknifólk",
    "saleTitle": "Til leigu",
    "saleText": "Veldu flokk og berðu saman stærðir, innihald og notkun. Hver lína getur orðið upphafið að beiðni.",
    "cardPrice": "Verð",
    "cardRange": "Úrval",
    "cardService": "Þjónusta",
    "cardView": "Skoða úrval",
    "cardEnquire": "Velja í beiðni",
    "moreTitle": "Fleiri leiguflokkar",
    "moreText": "Fleiri flokkar í leigu Exton.",
    "moreView": "Skoða flokkinn",
    "howTitle": "Frá búnaði að beiðni",
    "how1": "Veldu búnað",
    "how1Text": "Skoðaðu stærðir og innihald. Bættu við magni og fleiri hlutum í beiðninni.",
    "how2": "Leiga eða viðburður",
    "how2Text": "Sækir þú búnaðinn eða á Exton að flytja, setja upp, stjórna og taka niður?",
    "how3": "Dagsetningar og staður",
    "how3Text": "Skráðu leigutíma eða viðburðardag og staðsetningu. Verð og framboð þarfnast staðfestingar.",
    "priceTitle": "Úrval í hnotskurn",
    "priceText": "Raunverulegar stærðir og pakkar. Verð á fyrirspurn fyrir allan búnað.",
    "priceItem": "Búnaður",
    "priceDay": "Stærð eða notkun",
    "priceWeek": "Verð",
    "endTitle": "Leigan í Kópavogi og á Akureyri",
    "endText": "Hafðu samband um búnað og þjónustu við viðburðinn.",
    "needQuote": "Leigusvið",
    "needQuoteText": "Fyrirspurnir um búnað og viðburði.",
    "needQuoteGo": "575 4600",
    "needSetup": "Viðburður með mannskap",
    "needSetupText": "Flutningur, uppsetning, stjórn og niðurtekt.",
    "needSetupGo": "Lýsa viðburði",
    "needMap": "Starfsstöðvar",
    "needMapText": "Vesturvör 30c, 200 Kópavogur. Goðanes 4, 603 Akureyri.",
    "needMapGo": "Kort af Kópavogi",
    "sourceLink": "Nánari upplýsingar"
  },
  "en": {
    "htmlLang": "en",
    "skip": "Skip to content",
    "brand": "Exton hire, home",
    "logoAlt": "Exton",
    "about": "About Exton",
    "contact": "Request a quote",
    "home": "Home",
    "forSale": "For hire",
    "forSaleAria": "Equipment for hire",
    "menuLabel": "Menu",
    "menuCloseLabel": "Close",
    "menuOpen": "Open menu",
    "menuClose": "Close menu",
    "nav": "Main menu",
    "navPrimary": "Pages",
    "requests": "Requests, sample",
    "phoneLabel": "Phone",
    "langSwitch": "Íslenska",
    "pickerAria": "Choose an equipment category",
    "homeTile": "Hire",
    "homeTileBlurb": "Equipment and technicians",
    "scrollHint": "(Scroll)",
    "scroll": "Scroll",
    "next": "Next",
    "play": "Play",
    "stop": "Stop",
    "close": "Close",
    "colophon": "Exton ehf. · Kópavogur · Akureyri",
    "homeLead": "From birthdays to concerts.",
    "homeTitle": "Exton hire | Sound, stages, tents and instruments",
    "homeDesc": "Sound systems, stages, event tents and instruments for hire from Exton. Choose equipment hire or service with technicians. Kópavogur and Akureyri.",
    "chipNote": "Availability and price are confirmed in a quote.",
    "creditPre": "Designed by",
    "creditAria": "Designed by SNDR Studio",
    "protoNote": "Prototype of Exton’s rental website. Nothing is sent and no equipment is reserved.",
    "nextLabel": "Next category",
    "ctaLink": "Build a request",
    "aboutTitle": "About Exton | Hire and service",
    "aboutDesc": "Exton hires out event equipment with or without crew. Its Kópavogur and Akureyri branches serve all of Iceland.",
    "aboutMarquee": "Exton",
    "aboutLabel": "(The company)",
    "aboutH1": "Hire and technicians at Exton",
    "aboutStatementLead": "Exton",
    "aboutStatement": "hires out equipment with or without crew. The team brings experience from theatres, events, concerts and television.",
    "aboutFilmAlt": "A concert with stage lighting and a sound system",
    "aboutFilmLink": "Read about the company on exton.is",
    "aboutQuote": "Sound, lighting and video for the event.",
    "aboutQuoteAlt": "An audio mixing console from Exton’s image library",
    "aboutMarquee2": "Service",
    "aboutLabel2": "(Hire and service)",
    "aboutValuesLead": "Exton technicians",
    "aboutValues": "set up equipment, operate it during the event and take it down afterwards.",
    "aboutLabel3": "(Branches)",
    "aboutHistoryLead": "Kópavogur and Akureyri.",
    "aboutHistory": "Exton serves all of Iceland. Select a branch in the request and describe the event location.",
    "aboutLabel4": "(Hire team)",
    "pillars": "(01)|(02)|(03)|(04)",
    "aboutCta": "Explore the equipment.",
    "aboutCtaLink": "Sound systems for hire",
    "aboutBreak": "An outdoor concert stage from Exton’s image library",
    "contactTitle": "Request a quote | Exton hire",
    "contactDesc": "Choose equipment hire or an event with crew. Add equipment, dates and location to a local summary. Prototype, nothing sent.",
    "contactWord": "Enquiry",
    "contactH1": "Hire or event enquiry",
    "contactHeading": "Equipment, place and time.",
    "chOffice": "Hire phone",
    "chMail": "Hire email",
    "chHours": "Branches",
    "hoursText": "Vesturvör 30c, Kópavogur · Goðanes 4, Akureyri",
    "copyDone": "Email copied",
    "copyAria": "Copy email address ",
    "tabRental": "HIRE",
    "tabJob": "FULL SERVICE",
    "tabsAria": "Enquiry type",
    "fName": "Name *",
    "fEmail": "Email *",
    "fPhone": "Phone *",
    "fCompany": "Company",
    "fProduct": "Equipment or tent size *",
    "fQty": "Quantity *",
    "fFrom": "Hire from *",
    "fTo": "Hire to *",
    "fPickup": "Collection branch *",
    "fMessage": "Further details and preferences",
    "fAddress": "Venue and address *",
    "fStart": "Event date *",
    "fPhotos": "Venue photos",
    "hintRental": "I collect and use the equipment myself. Staff confirm availability and price.",
    "hintSize": "Approximate space and attendance are enough for an initial enquiry.",
    "hintPhotos": "Optional. Photos remain in your browser and are not sent. You can also describe the venue in text.",
    "consent": "I understand this is a local summary in a prototype. ",
    "consentLink": "About your information",
    "consentTail": ".",
    "send": "Review summary",
    "sending": "Preparing summary…",
    "phonePh": "Phone",
    "phoneNeeded": "Enter a phone number.",
    "formError": "Check the required fields. Nothing was sent.",
    "sampleForm": "Prototype. Nothing is sent, stored on a server or reserved. * Required fields.",
    "thanksTitle": "Request summary",
    "thanksText": "This summary is only in this browser.",
    "thanksNote": "Nothing was sent. To request a quote, contact leiga@exton.is or 575 4600.",
    "thanksMore": "Back to the request",
    "thanksRental": "HIRE · I collect and use the equipment.",
    "thanksJob": "FULL SERVICE · Delivery, set-up, operation and removal with Exton.",
    "policyTitle": "Information in this prototype",
    "policy": "<p>Your information is only used to display a summary in your browser. Nothing is sent to Exton or SNDR Studio or stored on a server. Photos do not leave your device.</p><p>Reloading or leaving the request clears the information. The prototype confirms neither price nor availability.</p>",
    "notFoundTitle": "Page not found | Exton",
    "notFoundDesc": "This page is not in the Exton hire prototype. Browse the equipment or build an enquiry.",
    "notFoundWord": "404",
    "notFoundHeading": "Page not found.",
    "chExplore": "Equipment",
    "chBack": "Hire homepage",
    "chHelp": "Enquiry",
    "chContactUs": "Build a request",
    "notFoundText": "Browse the equipment on the homepage or start an enquiry about your event.",
    "ovTitle": "Requests, sample data | Exton",
    "ovDesc": "A sample of structured hire requests. Equipment, quantity, dates, venue, branch and missing details. Every entry is fictional.",
    "ovMarquee": "Requests",
    "ovLabel": "(Sample)",
    "ovH1": "Requests, staff sample",
    "ovLead": "Request overview.",
    "ovStatement": "Equipment, quantities, dates and venue in one entry. Open a sample to see attachments and missing information.",
    "ovNoticeTag": "Sample data",
    "ovNotice": "Every entry is fictional. None comes from Exton or its customers.",
    "ovInboxTitle": "Enquiries",
    "ovInboxSub": "Select an entry to see its details.",
    "ovCol1": "Type",
    "ovCol2": "Equipment",
    "ovCol3": "Venue",
    "ovCol4": "Dates",
    "ovCol5": "Branch",
    "ovCol6": "Status",
    "ovCta": "Build your own request.",
    "ovCtaLink": "Open an enquiry",
    "ovBreak": "A concert stage from Exton’s image library",
    "homeSub": "Sound systems, stages, event tents and instruments. Hire the equipment or have Exton handle the event’s technical production.",
    "homeCtaEnquire": "Request a quote",
    "homeCtaSale": "Browse equipment",
    "factsAria": "Hire at a glance",
    "factFrom": "branches",
    "factHeight": "event tent sizes",
    "factHoist": "roofed trailer stages",
    "factFounded": "equipment and technicians",
    "saleTitle": "For hire",
    "saleText": "Choose a category and compare sizes, components and uses. Each row can start your request.",
    "cardPrice": "Price",
    "cardRange": "Range",
    "cardService": "Service",
    "cardView": "Explore range",
    "cardEnquire": "Add to request",
    "moreTitle": "More hire categories",
    "moreText": "More categories in Exton’s hire range.",
    "moreView": "View category",
    "howTitle": "From equipment to enquiry",
    "how1": "Choose equipment",
    "how1Text": "Compare sizes and components. Add quantities and more items in the request.",
    "how2": "Hire or full service",
    "how2Text": "Will you collect the equipment, or should Exton deliver, set up, operate and remove it?",
    "how3": "Dates and venue",
    "how3Text": "Enter the hire period or event date and location. Price and availability require confirmation.",
    "priceTitle": "Range at a glance",
    "priceText": "Real sizes and packages. Price on request for all equipment.",
    "priceItem": "Equipment",
    "priceDay": "Size or use",
    "priceWeek": "Price",
    "endTitle": "Hire in Kópavogur and Akureyri",
    "endText": "Get in touch about equipment and event services.",
    "needQuote": "Hire team",
    "needQuoteText": "Enquiries about equipment and events.",
    "needQuoteGo": "575 4600",
    "needSetup": "An event with crew",
    "needSetupText": "Delivery, set-up, operation and removal.",
    "needSetupGo": "Describe the event",
    "needMap": "Branches",
    "needMapText": "Vesturvör 30c, 200 Kópavogur. Goðanes 4, 603 Akureyri.",
    "needMapGo": "Kópavogur map",
    "sourceLink": "More information"
  }
}
export const companyEntry: PreviewCompany = {
 slug: 'exton', route: '/preview/exton', name: 'Exton leiga', sector: 'Viðburðabúnaður til leigu', location: 'Kópavogur og Akureyri', region: 'Ísland', established: '', currentUrl: 'https://exton.is/leiga/', ownerEmail: '', concept: 'Búnaður, staður og tími', conceptTagline: 'Leigufyrirspurn með búnaði, magni, stað og tíma. Leiga eða viðburður með mannskap.', accent: '#71D2FF', dark: false, status: 'Concept ready', thumb: `${BASE}exton/hero-s.webp`, ownPhotography: true, photoCredit: 'Myndir og merki af exton.is. Upplýsingar sóttar 28. október 2026.', audit: { strengths: ['Leiga með eða án mannskaps', 'Tvær starfsstöðvar'], weaknesses: ['Almenn leigufyrirspurn spyr um nafn, netfang, síma og skilaboð'], opportunities: ['Búnaður og magn í beiðni', 'Viðburðarstaður og tímasetningar'] }, positioning: 'Frumgerð fyrir leiguhluta Exton.', outreach: { subject: '', body: '' }
}

/* v2 (2026-11-03): Erling's structure on our system. Occasion → product mapping is an editorial decision taken from each
 * product's own coverage text on exton.is; `extra` points at OTHER_RENTALS (0 lights, 1 streaming, 2 party gear, 3 bouncy castles),
 * which live on exton.is and are linked out, labelled as such. */
export interface Occasion { key: string; name: Bi; line: Bi; img: string; items: string[]; extra: number[] }
export const OCCASIONS: Occasion[] = [
  { key: 'afmaeli', name: { is: 'Afmæli', en: 'Birthdays' }, line: { is: 'Hljóð fyrir ræður og tónlist, og tjöld fyrir garðinn.', en: 'Sound for speeches and music, and tents for the garden.' }, img: 'party', items: ['rcf1', 'rcf2', 'evox1', 'evox2', 'r6-36', 'r6-54', 'top16', 'top25', 'gala20', 'gala30'], extra: [2, 3] },
  { key: 'brudkaup', name: { is: 'Brúðkaup', en: 'Weddings' }, line: { is: 'Hljóð fyrir veisluna og hljómsveitina, tjöld fyrir gestina og pallur fyrir ræðurnar.', en: 'Sound for the party and the band, tents for the guests and a platform for the speeches.' }, img: 'furniture', items: ['evox2', 'nexo', 'meyer', 'r6-72', 'r6-90', 'r8-72', 'r8-96', 'r8-120', 'gala45', 'deck', 'lysing'], extra: [2] },
  { key: 'streymi', name: { is: 'Streymi', en: 'Streaming' }, line: { is: 'Streymisbúnaður, hljóð fyrir þann sem talar og ljós. Engin tjöld og engin borð.', en: 'Streaming gear, sound for the speaker and lights. No tents and no tables.' }, img: 'mixer', items: ['streymi', 'rcf1', 'lysing', 'ljosabord'], extra: [] },
  { key: 'fundur', name: { is: 'Fundur og ráðstefna', en: 'Meetings' }, line: { is: 'Hljóð fyrir ræðuhöld og pallur fyrir þann sem talar.', en: 'Sound for speeches and a platform for the speaker.' }, img: 'mic', items: ['rcf1', 'rcf2', 'evox1', 'deck', 'streymi', 'lysing'], extra: [] },
  { key: 'tonleikar', name: { is: 'Tónleikar', en: 'Concerts' }, line: { is: 'Hljóðkerfi, svið og hljóðfæri, frá litlum sal upp í stórtónleika.', en: 'Sound systems, stages and instruments, from a small hall to a festival.' }, img: 'lights', items: ['nexo', 'meyer', 'stage8', 'stage10', 'seelite', 'deck', 'drums', 'guitaramp', 'bassamp', 'keys', 'lysing', 'ljosabord', 'streymi'], extra: [] },
  { key: 'uti', name: { is: 'Útiviðburður', en: 'Outdoor events' }, line: { is: 'Svið, stór tjöld og hljóð sem ber út á túnið.', en: 'Stages, large tents and sound that carries across the field.' }, img: 'stage', items: ['nexo', 'meyer', 'stage8', 'stage10', 'seelite', 'r8-96', 'r8-120', 'r8-144', 'top16', 'top25', 'gala30', 'gala45'], extra: [3, 2] },
  { key: 'arshatid', name: { is: 'Árshátíð', en: 'Company parties' }, line: { is: 'Hljóð fyrir sal og hljómsveit, og pallur fyrir veislustjórann.', en: 'Sound for the hall and the band, and a platform for the host.' }, img: 'hero', items: ['evox2', 'nexo', 'meyer', 'deck', 'drums', 'keys', 'lysing'], extra: [2] },
]
export const BRANDS = ['RCF', 'EVOX', 'NEXO', 'Meyer'] as const
export const brandOf = (label: string) => BRANDS.find((b) => label.toUpperCase().startsWith(b.toUpperCase())) ?? ''
export const guestBand = (coverage: string) => { // "Um 30-50 manns" → band of the upper number; unconfirmed counts get none
  const m = coverage.match(/(\d+)\s*[-–]\s*(\d+)/); if (!m) return ''
  const hi = Number(m[2]); return hi <= 50 ? 'g50' : hi <= 100 ? 'g100' : 'g250'
}
export const FT: Record<Lang, Record<string, string>> = {
  is: {
    nav: 'Búnaður', title: 'Búnaður til leigu | Exton', desc: 'Veldu tilefnið og síaðu leigubúnað Exton eftir flokki, stærð og gerð. Það sem þú velur fer beint í beiðnina.',
    h1: 'Búnaður til leigu', ask: 'Hvað ert þú að fara að gera?', lead: 'Veldu tilefnið og síaðu svo eftir flokki, stærð og gerð. Það sem þú velur fer beint í beiðnina.',
    all: 'Allt', allLine: 'Allur leigubúnaðurinn á einum stað.', filters: 'Síur', fCat: 'Flokkur', fGuests: 'Tjöld eftir gestafjölda', fBrand: 'Hljóðkerfi',
    g50: 'Allt að 50 gestir', g100: '50 til 100 gestir', g250: 'Yfir 100 gestir', chipTent: 'Tjöld', chipSound: 'Hljóðkerfi',
    count1: 'hlutur', countN: 'hlutir', clear: 'Hreinsa síur', empty: 'Ekkert passar við þessar síur.', emptyGo: 'Hreinsa síur',
    add: 'Bæta í beiðni', added: 'Í beiðni', more: 'Nánar', also: 'Líka fyrir þetta tilefni', price: 'Verð á fyrirspurn',
    list: 'Beiðnin þín', send: 'Senda beiðni', empty2: 'Tæma', show: 'Sýna', close: 'Loka síum', open: 'Síur', remove: 'Fjarlægja síu',
    homeTitle: 'Hvað ert þú að fara að gera?', homeText: 'Veldu tilefnið og sjáðu aðeins búnaðinn sem passar.', homeAll: 'Allur búnaður', occasion: 'Tilefni',
    search: 'Leita að búnaði, til dæmis tjald eða hljóðnemi', searchChip: 'Leit', shopLink: 'Vefverslun fyrir minni viðburði',
  },
  en: {
    nav: 'Equipment', title: 'Equipment for hire | Exton', desc: 'Choose the occasion and filter Exton’s hire equipment by category, size and model. What you pick goes straight into the request.',
    h1: 'Equipment for hire', ask: 'What are you planning?', lead: 'Choose the occasion, then filter by category, size and model. What you pick goes straight into the request.',
    all: 'All', allLine: 'All hire equipment in one place.', filters: 'Filters', fCat: 'Category', fGuests: 'Tents by guest count', fBrand: 'Sound systems',
    g50: 'Up to 50 guests', g100: '50 to 100 guests', g250: 'Over 100 guests', chipTent: 'Tents', chipSound: 'Sound',
    count1: 'item', countN: 'items', clear: 'Clear filters', empty: 'Nothing matches these filters.', emptyGo: 'Clear filters',
    add: 'Add to request', added: 'In request', more: 'Details', also: 'Also for this occasion', price: 'Price on request',
    list: 'Your request', send: 'Send request', empty2: 'Clear', show: 'Show', close: 'Close filters', open: 'Filters', remove: 'Remove filter',
    homeTitle: 'What are you planning?', homeText: 'Choose the occasion and see only the equipment that fits.', homeAll: 'All equipment', occasion: 'Occasion',
    search: 'Search equipment, for example tent or microphone', searchChip: 'Search', shopLink: 'Shop for smaller events',
  },
}

/* v2b (2026-11-03): lighting and streaming as real categories, from exton.is/leiga/ljosabunadur-til-leigu and
 * /streymisbunadur-til-leigu (their own wording and photos; those pages offer services, not itemised kit). */
PRODUCTS.push(
  { key: 'streymi', cat: 'mynd', label: { is: 'Streymisbúnaður', en: 'Streaming equipment' }, spec: { is: 'Mynd-, ljósa-, hljóð- og hugbúnaður, og þarfagreining með þér', en: 'Video, lighting, audio and software, with a needs assessment' }, coverage: { is: 'Ráðstefnur, íbúafundir, fyrirlestrar og kynningar', en: 'Conferences, town meetings, lectures and presentations' }, source: 'https://exton.is/leiga/streymisbunadur-til-leigu/', image: 'streymi' },
  { key: 'lysing', cat: 'ljos', label: { is: 'Lýsing fyrir viðburð', en: 'Event lighting' }, spec: { is: 'Hönnun, val á ljósum, uppsetning, forritun og keyrsla', en: 'Design, choice of lights, set-up, programming and operation' }, coverage: { is: 'Tónleikar, ráðstefnur, árshátíðir og aðrir viðburðir', en: 'Concerts, conferences, company parties and other events' }, source: 'https://exton.is/leiga/ljosabunadur-til-leigu/', image: 'lysing' },
  { key: 'ljosabord', cat: 'ljos', label: { is: 'Ljósaborð og ljósastýringar', en: 'Lighting consoles' }, spec: { is: 'Ljósastýringar í mörgum stærðum, helst frá MA Lighting', en: 'Lighting consoles in many sizes, mainly MA Lighting' }, coverage: { is: 'Exton aðstoðar við val á borði fyrir verkefnið', en: 'Exton helps you choose the console for the job' }, source: 'https://exton.is/leiga/ljosabunadur-til-leigu/', image: 'ljosabord' },
)
export const EXTRA_CATS: Array<{ key: string; name: Bi; tile: string }> = [
  { key: 'ljos', name: { is: 'Ljós', en: 'Lighting' }, tile: 'amber' },
  { key: 'mynd', name: { is: 'Mynd og streymi', en: 'Video and streaming' }, tile: 'teal' },
]

/* v2b webshop slice: real products, prices (ISK, án vsk not stated; as shown on exton.is) and stock from exton.is's public
 * WooCommerce Store API, read 2026-11-03. 7 groups, up to 12 most popular each. Images: their 324 px thumbnails. */
export interface ShopItem { id: number; name: string; brand: string; cat: string; price: number; stock: boolean; url: string }
export const SHOP_CATS: Array<{ key: string; name: Bi }> = [
  { key: 'hatalarar', name: { is: 'Hátalarar', en: 'Speakers' } },
  { key: 'hljodnemar', name: { is: 'Hljóðnemar', en: 'Microphones' } },
  { key: 'thradlaust', name: { is: 'Þráðlaus hljóðbúnaður', en: 'Wireless audio' } },
  { key: 'mixerar', name: { is: 'Hljóðmixerar', en: 'Mixers' } },
  { key: 'ljos', name: { is: 'Ljós', en: 'Lighting' } },
  { key: 'reykvelar', name: { is: 'Reykvélar', en: 'Smoke machines' } },
  { key: 'confetti', name: { is: 'Confetti', en: 'Confetti' } },
]
export const SHOP: ShopItem[] = [{"id": 1981, "name": "RCF ART 932-A", "brand": "RCF", "cat": "hatalarar", "price": 195729, "stock": false, "url": "https://exton.is/vara/digital-active-speaker-system-12-3-v-c-1050wrms-2100wpeak/"}, {"id": 2483, "name": "QSC AD-C4T 2-Way Ceiling-Mount Loudspeaker – White", "brand": "QSC", "cat": "hatalarar", "price": 26573, "stock": false, "url": "https://exton.is/vara/4-5-two-way-ceiling-speaker-70-100v-transformer-with-16-bypass-150-conical-dmt-coverage-color-white/"}, {"id": 2574, "name": "QSC AD-P6T Pendant-mount Loudspeaker – Black", "brand": "QSC", "cat": "hatalarar", "price": 60718, "stock": false, "url": "https://exton.is/vara/6-5-two-way-pendant-speaker-70-100v-transformer-with-16-bypass-135-conical-dmt-coverage-color-black/"}, {"id": 2579, "name": "QSC AD-C6T Two-Way Ceiling Loudspeaker – Black", "brand": "QSC", "cat": "hatalarar", "price": 34577, "stock": false, "url": "https://exton.is/vara/6-5-two-way-ceiling-speaker-70-100v-transformer-with-16-bypass-135-conical-dmt-coverage-color-black/"}, {"id": 2582, "name": "QSC AD-P4T Pendant-mount Loudspeaker – White", "brand": "QSC", "cat": "hatalarar", "price": 47210, "stock": false, "url": "https://exton.is/vara/4-5-two-way-pendant-speaker-70-100v-transformer-with-16-bypass-150-conical-dmt-coverage-color-white/"}, {"id": 2586, "name": "QSC AD-C4T-LP Low-Profile Ceiling Loudspeaker – White", "brand": "QSC", "cat": "hatalarar", "price": 35125, "stock": true, "url": "https://exton.is/vara/4-5-two-way-low-profile-ceiling-speaker-70-100v-transformer-with-16-bypass-150-conical-dmt-coverage-white-only/"}, {"id": 2596, "name": "QSC AP-212sw Dual 12-inch subwoofer", "brand": "QSC", "cat": "hatalarar", "price": 222230, "stock": true, "url": "https://exton.is/vara/dual-12-folded-baffle-subwoofer-2x-pole-cups-for-horizontal-or-vertical-deployments-dual-crossed-nl4-inputs-available-in-black-only/"}, {"id": 2627, "name": "QSC AD-S.SUB 6.5-inch Subwoofer – White", "brand": "QSC", "cat": "hatalarar", "price": 89476, "stock": true, "url": "https://exton.is/vara/6-5-dual-voice-coil-surface-subwoofer-high-pass-output-up-to-four-satellite-speakers-70-100v-transformer-for-mono-or-bypass-color-white/"}, {"id": 2634, "name": "QSC AD-P.SUB Small Format Passive Pendant Subwoofer – Black", "brand": "QSC", "cat": "hatalarar", "price": 77261, "stock": false, "url": "https://exton.is/vara/6-5-dual-voice-coil-pendant-subwoofer-provides-high-pass-output-for-up-to-four-satellite-speakers-70-100v-transformer-with-4-bypass-color-black/"}, {"id": 2659, "name": "QSC AC-C4T 4″ Ceiling-Mount Loudspeakers – White", "brand": "QSC", "cat": "hatalarar", "price": 20514, "stock": true, "url": "https://exton.is/vara/4-5-full-range-ceiling-speaker-70-100v-transformer-with-8-bypass-140-conical-coverage-includes-c-ring-and-rails-for-blind-mount-installation/"}, {"id": 2666, "name": "QSC AC-C8T 8″ 2-Way 80W Ceiling Loudspeaker – White", "brand": "QSC", "cat": "hatalarar", "price": 38355, "stock": true, "url": "https://exton.is/vara/8-two-way-ceiling-speaker-70-100v-transformer-with-8-bypass-90-conical-coverage-includes-c-ring-and-rails-for-blind-mount-installation/"}, {"id": 2673, "name": "QSC AC-S4T 4″ 2-Way 16W Loudspeaker – Black", "brand": "QSC", "cat": "hatalarar", "price": 21908, "stock": true, "url": "https://exton.is/vara/4-5-two-way-surface-speaker-70-100v-transformer-with-8-bypass-130-conical-coverage-includes-yoke-mount-color-black/"}, {"id": 5719, "name": "sE Electronics X1 Series Condenser Microphone and Clip", "brand": "sE Electronics", "cat": "hljodnemar", "price": 20887, "stock": true, "url": "https://exton.is/vara/x1-series-condenser-microphone-and-clip/"}, {"id": 677, "name": "MIPRO MU-55L 4.5mm professional subminiature omni-directional Lavalier microphone. (Black)", "brand": "MiPro", "cat": "hljodnemar", "price": 12806, "stock": true, "url": "https://exton.is/vara/4-5mm-professional-subminiature-omni-directional-lavalier-mipro-microphone-black/"}, {"id": 813, "name": "Audix OM7 – Professional Dynamic Vocal Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 61198, "stock": true, "url": "https://exton.is/vara/hh-dyn-vocal-mic/"}, {"id": 819, "name": "Audix OM5 – Professional Dynamic Vocal Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 42206, "stock": true, "url": "https://exton.is/vara/hh-dyn-vocal-mic-3/"}, {"id": 821, "name": "Audix OM3 – Multi-Purpose Vocal and Instrument Dynamic Vocal Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 23389, "stock": false, "url": "https://exton.is/vara/hh-dyn-vocal-mic-4/"}, {"id": 826, "name": "Audix OM2 – All-Purpose Professional Dynamic Vocal Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 23389, "stock": true, "url": "https://exton.is/vara/hh-dyn-vocal-mic-5/"}, {"id": 1298, "name": "Audix D6 – Professional Dynamic Instrument Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 46954, "stock": true, "url": "https://exton.is/vara/dynamic-kick-drum-mic/"}, {"id": 1299, "name": "Audix D4 – Professional Dynamic Instrument Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 44668, "stock": true, "url": "https://exton.is/vara/dynamic-instrument-mic/"}, {"id": 1301, "name": "Audix D2 – Professional Dynamic Instrument Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 44668, "stock": true, "url": "https://exton.is/vara/dynamic-instrument-mic-2/"}, {"id": 1302, "name": "Audix OM6 – Professional Dynamic Vocal Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 48009, "stock": true, "url": "https://exton.is/vara/hh-dyn-vocal-mic-2/"}, {"id": 1532, "name": "Audix VX5 – Premium Electret Condenser Vocal Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 61198, "stock": true, "url": "https://exton.is/vara/hh-cond-mic/"}, {"id": 1533, "name": "Audix VX10 – Elite Condenser Vocal Microphone", "brand": "Audix", "cat": "hljodnemar", "price": 122572, "stock": false, "url": "https://exton.is/vara/hh-cond-vocal-mic/"}, {"id": 697, "name": "MIPRO ACT-727 Dual True-Diversity Receiver 19″, 5UA", "brand": "MiPro", "cat": "thradlaust", "price": 132181, "stock": false, "url": "https://exton.is/vara/dual-true-diversity-receiver-19-5ua/"}, {"id": 711, "name": "MIPRO ACT-311B 1/2-Rack Single-Channel Diversity Receiver  (Metal Case)", "brand": "MiPro", "cat": "thradlaust", "price": 26833, "stock": true, "url": "https://exton.is/vara/1-2-rack-single-channel-diversity-receiver-metal-case/"}, {"id": 2509, "name": "MIPRO AD-12 Passive Antenna Divider/Combiner", "brand": "MiPro", "cat": "thradlaust", "price": 11892, "stock": true, "url": "https://exton.is/vara/passive-antenna-divider-combiner/"}, {"id": 2669, "name": "MIPRO ACT-311 Single-Channel Diversity Receiver 6A", "brand": "MiPro", "cat": "thradlaust", "price": 38419, "stock": true, "url": "https://exton.is/vara/mipro-act-311-single-channel-diversity-receiver-6a/"}, {"id": 2685, "name": "MIPRO ACT-747-DANTE Quad-Channel True Diversity Receiver with DANTE 5UA", "brand": "MiPro", "cat": "thradlaust", "price": 315131, "stock": false, "url": "https://exton.is/vara/quad-channel-true-diversity-receiver-with-dante-5ua/"}, {"id": 2873, "name": "MIPRO ACT32T Body Pack Transmitter Only 6A", "brand": "MiPro", "cat": "thradlaust", "price": 31101, "stock": true, "url": "https://exton.is/vara/body-pack-transmitter-only-plastic-housing-lcd-6a/"}, {"id": 2880, "name": "MIPRO ACT-32TC Rechargeable Body Pack Transmitter Only 6A", "brand": "MiPro", "cat": "thradlaust", "price": 38419, "stock": true, "url": "https://exton.is/vara/rechargeable-body-pack-transmitter-only-6a-plastic-housing-lcd-with-1-x-18500-lithium-battery/"}, {"id": 3406, "name": "MIPRO FB-71 Half U model chassis fixed angle bracket", "brand": "MiPro", "cat": "thradlaust", "price": 5946, "stock": true, "url": "https://exton.is/vara/rack-mount-kit-for-1-act-311-312-717-half-rack-receiver-1-pair/"}, {"id": 3408, "name": "MIPRO MI-909R Digital Stereo Bodypack Receiver", "brand": "MiPro", "cat": "thradlaust", "price": 67234, "stock": true, "url": "https://exton.is/vara/digital-stereo-bodypack-receiver/"}, {"id": 3409, "name": "MIPRO MI-909T UHF Digital Stereo Transmitter Unit", "brand": "MiPro", "cat": "thradlaust", "price": 64032, "stock": true, "url": "https://exton.is/vara/digital-stereo-transmitter-unit/"}, {"id": 3410, "name": "MIPRO MI-58T 5.8GHz Digital Stereo Transmitter Unit", "brand": "MiPro", "cat": "thradlaust", "price": 67234, "stock": false, "url": "https://exton.is/vara/5-8ghz-digital-stereo-transmitter-unit/"}, {"id": 3411, "name": "MIPRO MI-58TD 5.8GHz Digital Stereo Transmitter Unit with Built-In Dante", "brand": "MiPro", "cat": "thradlaust", "price": 105653, "stock": false, "url": "https://exton.is/vara/5-8ghz-digital-stereo-transmitter-unit-with-built-in-dante/"}, {"id": 715, "name": "Allen & Heath ZED-6FX", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 34151, "stock": true, "url": "https://exton.is/vara/zed-6fx-2-mic-line-inputs-2-stereos-fx/"}, {"id": 721, "name": "Allen & Heath ZED-6", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 22869, "stock": false, "url": "https://exton.is/vara/zed-6-2-mic-line-inputs-2-stereos/"}, {"id": 735, "name": "Allen & Heath ZEDi10", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 45432, "stock": true, "url": "https://exton.is/vara/zedi10-10-channel-live-usb-recording-mixer/"}, {"id": 1146, "name": "Allen & Heath SQ-7 48ch digital mixer", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 815650, "stock": false, "url": "https://exton.is/vara/sq-7-48ch-digital-mixer-96khz-32-mic-line-16-xlr-out-8fx-33-faders-touchscreen-slink-i-o-port/"}, {"id": 1147, "name": "Allen & Heath SQ-6 48ch digital mixer", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 625383, "stock": false, "url": "https://exton.is/vara/sq-6-48ch-digital-mixer-96khz-24-mic-line-14-xlr-out-8fx-25-faders-touchscreen-slink-i-o-port/"}, {"id": 1149, "name": "Allen & Heath SQ-5 Mixer", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 497013, "stock": false, "url": "https://exton.is/vara/sq-5-48ch-digital-mixer-96khz-16-mic-line-12-xlr-out-8fx-17-faders-touchscreen-slink-i-o-port-rackmountable/"}, {"id": 1161, "name": "Allen & Heath ZED16FX", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 128979, "stock": false, "url": "https://exton.is/vara/zed16fx-10-mic-line-inputs-3-stereo-sources-usb-fx-and-sonar-x1-l-e/"}, {"id": 1162, "name": "Allen & Heath ZED60-14FX", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 96658, "stock": true, "url": "https://exton.is/vara/zed60-14fx-8-mic-line-inputs-2-stereos-60mm-faders-usb-fx/"}, {"id": 1163, "name": "Allen & Heath ZED60-10FX", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 85986, "stock": true, "url": "https://exton.is/vara/zed60-10fx-4-mic-line-inputs-2-stereos-60mm-faders-usb-fx/"}, {"id": 1164, "name": "Allen & Heath ZED-10FX", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 64337, "stock": false, "url": "https://exton.is/vara/zed-10fx-4-mic-line-inputs-2-stereos-usb-fx/"}, {"id": 1165, "name": "Allen & Heath ZEDi-10FX", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 57019, "stock": true, "url": "https://exton.is/vara/zedi-10fx-10-channel-live-usb-recording-mixer-with-fx/"}, {"id": 1166, "name": "Allen & Heath ZEDi-8", "brand": "ALLEN&HEATH", "cat": "mixerar", "price": 34151, "stock": false, "url": "https://exton.is/vara/zedi-8-8-channel-live-usb-recording-mixer/"}, {"id": 9577, "name": "Rosco E-Colour Orange", "brand": "Look", "cat": "ljos", "price": 441313, "stock": true, "url": "https://exton.is/vara/e-colour-orange/"}, {"id": 9576, "name": "Rosco E-Colour Follies Pink", "brand": "Rosco", "cat": "ljos", "price": 3596, "stock": true, "url": "https://exton.is/vara/e-colour-follies-pink/"}, {"id": 1180, "name": "Par 16 LED Warm-on dim", "brand": "Highlite", "cat": "ljos", "price": 12420, "stock": true, "url": "https://exton.is/vara/par-16-led-warm-on-dim/"}, {"id": 9573, "name": "Rosco E-Colour Just Blue", "brand": "Rosco", "cat": "ljos", "price": 2532, "stock": true, "url": "https://exton.is/vara/e-colour-just-blue/"}, {"id": 689, "name": "Speglakúla 30cm án mótors", "brand": "Highlite", "cat": "ljos", "price": 14702, "stock": true, "url": "https://exton.is/vara/speglakula-30cm-an-motors/"}, {"id": 698, "name": "Speglakúla 20cm án mótors", "brand": "Highlite", "cat": "ljos", "price": 6760, "stock": true, "url": "https://exton.is/vara/speglakula-20cm-an-motors/"}, {"id": 728, "name": "Par 20 LED Warm-on dim", "brand": "Highlite", "cat": "ljos", "price": 17775, "stock": true, "url": "https://exton.is/vara/par-20-led-warm-on-dim/"}, {"id": 745, "name": "grandMA3 onPC Command Wing 2048", "brand": "MA Lighting", "cat": "ljos", "price": 1051624, "stock": true, "url": "https://exton.is/vara/grandma3-onpc-command-wing-4-096-parametrar/"}, {"id": 753, "name": "Par 30 LED Warm-on dim", "brand": "Highlite", "cat": "ljos", "price": 21191, "stock": false, "url": "https://exton.is/vara/par-30-led-warm-on-dim/"}, {"id": 769, "name": "Speglakúla 40cm án mótors", "brand": "Highlite", "cat": "ljos", "price": 31394, "stock": true, "url": "https://exton.is/vara/speglakula-40cm-an-motors/"}, {"id": 1840, "name": "grandMA3 onPC command wing XT", "brand": "MA Lighting", "cat": "ljos", "price": 2252550, "stock": false, "url": "https://exton.is/vara/grandma3-onpc-command-wing-xt/"}, {"id": 1904, "name": "Speglakúlumótor 2rpm fyrir 30cm eða minni", "brand": "Highlite", "cat": "ljos", "price": 5656, "stock": true, "url": "https://exton.is/vara/speglakulumotor-2rpm-fyrir-30cm-eda-minni/"}, {"id": 6457, "name": "Look Solutions Flightcase Viper nt/2.6, with space for accessories", "brand": "Look", "cat": "reykvelar", "price": 67508, "stock": false, "url": "https://exton.is/vara/flightcase-viper-nt-2-6-with-space-for-accessories/"}, {"id": 6470, "name": "Look Solutions Cobra 3.1 230V Reykvél", "brand": "Look", "cat": "reykvelar", "price": 385393, "stock": false, "url": "https://exton.is/vara/cobra-3-1-230v-reykvel-3100-watt-1800-watt-at-120vextremely-silent-nozzle-touchscreen-dmx-512-timer-ethernet-rdm-incl-5l-regular-fog/"}, {"id": 6472, "name": "MAGICFX® SMOKEBUBBLE BLASTER", "brand": "MagicFX", "cat": "reykvelar", "price": 793070, "stock": false, "url": "https://exton.is/vara/magicfx-smokebubble-blaster/"}, {"id": 6473, "name": "Look Solutions Unique 2.1 230V", "brand": "Look", "cat": "reykvelar", "price": 229708, "stock": true, "url": "https://exton.is/vara/unique-2-1-230v/"}, {"id": 6477, "name": "Look Solutions Tiny CX", "brand": "Look", "cat": "reykvelar", "price": 199315, "stock": false, "url": "https://exton.is/vara/tiny-cxmini-fog-generator-70-watt-incl-battery-charger-internal-fluid-tank-50-ml-250-ml-fluid-carrying-case/"}, {"id": 6478, "name": "Look Solutions Viper NT", "brand": "Look", "cat": "reykvelar", "price": 190865, "stock": false, "url": "https://exton.is/vara/viper-nt-230v/"}, {"id": 6479, "name": "Look Solutions Tiny FX", "brand": "Look", "cat": "reykvelar", "price": 213754, "stock": false, "url": "https://exton.is/vara/tiny-fx-psu/"}, {"id": 6480, "name": "Look Solutions Power-Tiny", "brand": "Look", "cat": "reykvelar", "price": 180809, "stock": false, "url": "https://exton.is/vara/power-tiny/"}, {"id": 6485, "name": "Look Solutions Flightcase Unique 2.1", "brand": "Look", "cat": "reykvelar", "price": 64775, "stock": true, "url": "https://exton.is/vara/flightcase-unique-2-1/"}, {"id": 6489, "name": "Look Solutions Viper S 230V Reykvél", "brand": "Look", "cat": "reykvelar", "price": 156365, "stock": false, "url": "https://exton.is/vara/viper-s-230v-reykvel-fog-generator-650-wattinternal-dmx512-timer-as-standard-incl-2l-regular-fog/"}, {"id": 11207, "name": "MDG ATMe Haze generator", "brand": "MDG", "cat": "reykvelar", "price": 1127490, "stock": false, "url": "https://exton.is/vara/mdg-atme-haze-generator/"}, {"id": 11212, "name": "MDG ICE FOG Compack Low Fog Generator High Pressure version with a remote control", "brand": "MDG", "cat": "reykvelar", "price": 1545425, "stock": false, "url": "https://exton.is/vara/mdg-ice-fog-compack-low-fog-generator/"}, {"id": 1823, "name": "MAGICFX® Handheld Confetti 50cm – Marglitað – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 3528, "stock": true, "url": "https://exton.is/vara/handhheld-50cm-conf-multicol/"}, {"id": 1897, "name": "MAGICFX® Handheld Confetti 28cm – Marglitað – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 2935, "stock": true, "url": "https://exton.is/vara/handheld-28cm-confmulticolor/"}, {"id": 2120, "name": "MAGICFX® Confetti Handheld 80cm –  Dökkblátt  – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 4713, "stock": true, "url": "https://exton.is/vara/handheld-paper-conf-dark-blue/"}, {"id": 7376, "name": "MAGICFX® Handheld Confetti 28cm – Hvít Hjörtu – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 3264, "stock": true, "url": "https://exton.is/vara/handheld-cannon-28-cm-confetti-white-hearts/"}, {"id": 2089, "name": "MAGICFX® Handheld Confetti 50cm -Bleikt – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 3528, "stock": true, "url": "https://exton.is/vara/handheld-paper-conf-pink/"}, {"id": 2109, "name": "MAGICFX® Handheld Confetti 80cm – Marglitað – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 4713, "stock": true, "url": "https://exton.is/vara/handheld-paper-conf-mix/"}, {"id": 7380, "name": "MAGICFX® Handheld Confetti 80cm –  Bleikt – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 4713, "stock": true, "url": "https://exton.is/vara/handheld-cannon-80-cm-confetti-pink/"}, {"id": 1899, "name": "MAGICFX® Handheld Confetti 28 cm – Rauð Hjörtu – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 3264, "stock": true, "url": "https://exton.is/vara/handheld-28cm-red-hearts/"}, {"id": 2091, "name": "MAGICFX® Handheld Confetti 80cm – Gult – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 4713, "stock": true, "url": "https://exton.is/vara/handheld-paper-conf-yellow/"}, {"id": 3344, "name": "MAGICFX® Handheld Streamer 80cm – Dökkblátt  – Pappír", "brand": "MagicFX", "cat": "confetti", "price": 5636, "stock": true, "url": "https://exton.is/vara/confetti-cannon-handheld-80cm-streamers-dark-blu/"}, {"id": 1821, "name": "MAGICFX® Handheld Confetti 28cm – Hvítur Pappír + Silfur Metallic PVC", "brand": "MagicFX", "cat": "confetti", "price": 3114, "stock": false, "url": "https://exton.is/vara/handheld-28cm-conf-wht-sil/"}, {"id": 1832, "name": "MAGICFX® Handheld Confetti 50cm -Hvítur Pappír + Silfur Metallic PVC", "brand": "MagicFX", "cat": "confetti", "price": 3999, "stock": false, "url": "https://exton.is/vara/handheld-50cm-white-silver-metallic/"}]
export const ST: Record<Lang, Record<string, string>> = {
  is: { nav: 'Vefverslun', title: 'Vefverslun | Exton', desc: 'Hátalarar, hljóðnemar, ljós og fleira fyrir minni viðburði og heimilið, með verði og lagerstöðu.', h1: 'Vefverslun', lead: 'Fyrir minni viðburði og heimilið.', search: 'Leita að vöru eða framleiðanda', fCat: 'Flokkur', fBrand: 'Framleiðandi', fPrice: 'Verð', fStock: 'Lagerstaða', inStock: 'Til á lager', outStock: 'Ekki til á lager', p1: 'Undir 10.000 kr.', p2: '10.000 til 50.000 kr.', p3: '50.000 til 150.000 kr.', p4: 'Yfir 150.000 kr.', sort: 'Raða', sPop: 'Vinsælast', sLow: 'Verð: lægst fyrst', sHigh: 'Verð: hæst fyrst', sName: 'Nafn', add: 'Í körfu', added: 'Í körfunni', cart: 'Karfa', items1: 'vara', itemsN: 'vörur', view: 'Skoða körfu', checkout: 'Ganga frá pöntun', remove: 'Fjarlægja', total: 'Samtals', note: 'Frumgerð: greiðslan tengist vefversluninni og Navision í smíðinni. Ekkert er sent héðan.', more: 'Nánar', close: 'Loka körfu', empty: 'Ekkert passar við þessar síur.', clear: 'Hreinsa síur', back: 'Leiga eftir tilefni', backText: 'Ertu að leigja fyrir viðburð?' },
  en: { nav: 'Shop', title: 'Shop | Exton', desc: 'Speakers, microphones, lighting and more for smaller events and the home, with prices and stock.', h1: 'Shop', lead: 'For smaller events and the home.', search: 'Search products or brands', fCat: 'Category', fBrand: 'Brand', fPrice: 'Price', fStock: 'Stock', inStock: 'In stock', outStock: 'Out of stock', p1: 'Under 10,000 kr.', p2: '10,000 to 50,000 kr.', p3: '50,000 to 150,000 kr.', p4: 'Over 150,000 kr.', sort: 'Sort', sPop: 'Most popular', sLow: 'Price: low to high', sHigh: 'Price: high to low', sName: 'Name', add: 'Add to cart', added: 'In cart', cart: 'Cart', items1: 'item', itemsN: 'items', view: 'View cart', checkout: 'Checkout', remove: 'Remove', total: 'Total', note: 'Prototype: checkout connects to the shop and Navision in the build. Nothing is sent from here.', more: 'Details', close: 'Close cart', empty: 'Nothing matches these filters.', clear: 'Clear filters', back: 'Hire by occasion', backText: 'Hiring for an event?' },
}
