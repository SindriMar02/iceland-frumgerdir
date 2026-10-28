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
    "homeLead": "Búnaður fyrir viðburði.",
    "homeTitle": "Exton leiga | Hljóð, svið, tjöld og hljóðfæri",
    "homeDesc": "Hljóðkerfi, svið, veislutjöld og hljóðfæri til leigu hjá Exton. Veldu búnað eða þjónustu með tæknifólki. Kópavogur og Akureyri.",
    "chipNote": "Framboð og verð eru staðfest í tilboði.",
    "creditPre": "Designed by",
    "creditAria": "Designed by SNDR Studio",
    "protoNote": "Frumgerð af leiguvef Exton. Myndir og upplýsingar eru af exton.is. Ekkert er sent og enginn búnaður tekinn frá.",
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
    "moreText": "Fleiri flokkar á leiguvef Exton. Hlekkirnir opna núverandi vef fyrirtækisins.",
    "moreView": "Skoða á exton.is",
    "howTitle": "Frá búnaði að beiðni",
    "how1": "Veldu búnað",
    "how1Text": "Skoðaðu stærðir og innihald. Bættu við magni og fleiri hlutum í beiðninni.",
    "how2": "Leiga eða viðburður",
    "how2Text": "Sækir þú búnaðinn eða á Exton að flytja, setja upp, stjórna og taka niður?",
    "how3": "Dagsetningar og staður",
    "how3Text": "Skráðu leigutíma eða viðburðardag og staðsetningu. Verð og framboð þarfnast staðfestingar.",
    "priceTitle": "Úrval í hnotskurn",
    "priceText": "Raunverulegar stærðir og pakkar af exton.is. Verð á fyrirspurn fyrir allan búnað.",
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
    "sourceLink": "Upplýsingar á exton.is"
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
    "homeLead": "Equipment for events.",
    "homeTitle": "Exton hire | Sound, stages, tents and instruments",
    "homeDesc": "Sound systems, stages, event tents and instruments for hire from Exton. Choose equipment hire or service with technicians. Kópavogur and Akureyri.",
    "chipNote": "Availability and price are confirmed in a quote.",
    "creditPre": "Designed by",
    "creditAria": "Designed by SNDR Studio",
    "protoNote": "Prototype of Exton’s rental website. Images and information are from exton.is. Nothing is sent and no equipment is reserved.",
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
    "moreText": "More categories on Exton’s rental website. These links open the company’s current site.",
    "moreView": "View on exton.is",
    "howTitle": "From equipment to enquiry",
    "how1": "Choose equipment",
    "how1Text": "Compare sizes and components. Add quantities and more items in the request.",
    "how2": "Hire or full service",
    "how2Text": "Will you collect the equipment, or should Exton deliver, set up, operate and remove it?",
    "how3": "Dates and venue",
    "how3Text": "Enter the hire period or event date and location. Price and availability require confirmation.",
    "priceTitle": "Range at a glance",
    "priceText": "Real sizes and packages from exton.is. Price on request for all equipment.",
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
    "sourceLink": "Information on exton.is"
  }
}
export const companyEntry: PreviewCompany = {
 slug: 'exton', route: '/preview/exton', name: 'Exton leiga', sector: 'Viðburðabúnaður til leigu', location: 'Kópavogur og Akureyri', region: 'Ísland', established: '', currentUrl: 'https://exton.is/leiga/', ownerEmail: '', concept: 'Búnaður, staður og tími', conceptTagline: 'Leigufyrirspurn með búnaði, magni, stað og tíma. Leiga eða viðburður með mannskap.', accent: '#71D2FF', dark: false, status: 'Concept ready', thumb: `${BASE}exton/hero-s.webp`, ownPhotography: true, photoCredit: 'Myndir og merki af exton.is. Upplýsingar sóttar 28. október 2026.', audit: { strengths: ['Leiga með eða án mannskaps', 'Tvær starfsstöðvar'], weaknesses: ['Almenn leigufyrirspurn spyr um nafn, netfang, síma og skilaboð'], opportunities: ['Búnaður og magn í beiðni', 'Viðburðarstaður og tímasetningar'] }, positioning: 'Frumgerð fyrir leiguhluta Exton.', outreach: { subject: '', body: '' }
}
