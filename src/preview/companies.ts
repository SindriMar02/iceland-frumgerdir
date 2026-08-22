/**
 * PRIVATE prospect catalogue: every company brief, audit, positioning and
 * outreach email in one list, for the internal dashboard and outreach tooling.
 *
 * Do NOT import this module from a preview page. A preview route must import
 * only its own `./company` (or `./data`) record, or the whole catalogue ends
 * up in the chunk any prospect holding a preview link can download.
 * See [[preview-link-isolation]].
 *
 * Real, unconsented businesses: facts are public; the redesigns are concepts;
 * all sample prices/reviews are disclaimed in each page footer.
 */

import type { PreviewCompany } from './company-types'

export type { AuditList, PreviewCompany } from './company-types'

import { companyEntry as ERPSSTADIR_ENTRY } from './erpsstadir/company'
import { companyEntry as TJORUHUSID_ENTRY } from './tjoruhusid/company'
import { companyEntry as EKTAFISKUR_ENTRY } from './ektafiskur/company'
import { companyEntry as KAFFIHORNID_ENTRY } from './kaffihornid/company'
import { companyEntry as SEAKAYAK_ENTRY } from './seakayak/company'
import { companyEntry as WEIDER_ENTRY } from './weider/company'
import { companyEntry as AUSTRI_ENTRY } from './austri/company'
import { companyEntry as LYSULAUGAR_ENTRY } from './lysulaugar/company'
import { companyEntry as HESPA_ENTRY } from './hespa/company'
import { companyEntry as REYKKOFINN_ENTRY } from './reykkofinn/company'
import { companyEntry as GALDRASYNING_ENTRY } from './galdrasyning/company'
import { companyEntry as SAUDARKROKSBAKARI_ENTRY } from './saudarkroksbakari/company'
import { companyEntry as REYKJAVIKDISTILLERY_ENTRY } from './reykjavikdistillery/company'
import { companyEntry as BEFFATOURS_ENTRY } from './beffatours/company'
import { companyEntry as KOGGA_ENTRY } from './kogga/company'
import { companyEntry as HAAFELL_ENTRY } from './haafell/company'
import { companyEntry as POLARHESTAR_ENTRY } from './polarhestar/company'
import { companyEntry as EYJATOURS_ENTRY } from './eyjatours/company'
import { companyEntry as FISCHERSETUR_ENTRY } from './fischersetur/company'
import { companyEntry as EDINBORG_ENTRY } from './edinborg/company'
import { companyEntry as BRUNASTADIR_ENTRY } from './brunastadir/company'
import { companyEntry as GLACIERPARADISE_ENTRY } from './glacierparadise/company'
import { companyEntry as SIREKSSTADIR_ENTRY } from './sireksstadir/company'
import { companyEntry as CAVESOFHELLA_ENTRY } from './cavesofhella/company'
import { companyEntry as GAMLAFJOSID_ENTRY } from './gamlafjosid/company'
import { companyEntry as FAXIBAKERY_ENTRY } from './faxibakery/company'
import { companyEntry as GKBAKARI_ENTRY } from './gkbakari/company'
import { companyEntry as KIRKJUBAER_ENTRY } from './kirkjubaer/company'
import { companyEntry as VINLAND_ENTRY } from './vinland/company'
import { companyEntry as VELLIR_ENTRY } from './vellir/company'
import { companyEntry as HEITIRPOTTAR_ENTRY } from './heitirpottar/company'
import { companyEntry as SPORTSOL_ENTRY } from './sportsol/company'
import { companyEntry as SAELAN_ENTRY } from './saelan/company'
import { companyEntry as STJORNUSOL_ENTRY } from './stjornusol/company'
import { companyEntry as PASSION_ENTRY } from './passion/company'
import { companyEntry as REYNIR_ENTRY } from './reynir/company'
import { companyEntry as RAKARASTOFA_ENTRY } from './rakarastofa/company'
import { companyEntry as ARSOL_ENTRY } from './arsol/company'
import { companyEntry as STRYTAN_ENTRY } from './strytan/company'
import { companyEntry as SEIDKARLINN_ENTRY } from './seidkarlinn/company'
import { companyEntry as BILAGEIRINN_ENTRY } from './bilageirinn/company'
import { companyEntry as PRENTVERK_ENTRY } from './prentverk/company'
import { companyEntry as GEISLI_ENTRY } from './geisli/company'
import { companyEntry as PIPULAGNIR_ENTRY } from './pipulagnir/company'
import { companyEntry as SMARIHOLM_ENTRY } from './smariholm/company'
import { companyEntry as SAMVERK_ENTRY } from './samverk/company'
import { companyEntry as HUDFLUR_ENTRY } from './hudflur/company'
import { companyEntry as UNA_ENTRY } from './una/company'
import { companyEntry as FOTOGRAFI_ENTRY } from './fotografi/company'
import { companyEntry as FUZZY_ENTRY } from './fuzzy/company'
import { companyEntry as ELFA_ENTRY } from './elfa/company'
import { companyEntry as SELJAVELLIR_ENTRY } from './seljavellir/company'
import { companyEntry as LANGAHOLT_ENTRY } from './langaholt/company'
import { companyEntry as FISKKOMPANI_ENTRY } from './fiskkompani/company'
import { companyEntry as NAUSTID_ENTRY } from './naustid/company'
import { companyEntry as ALFACAFE_ENTRY } from './alfacafe/company'
import { companyEntry as SETBERG_ENTRY } from './setberg/company'
import { companyEntry as NYPUGARDAR_ENTRY } from './nypugardar/company'
import { companyEntry as LITLAHOF_ENTRY } from './litlahof/company'
import { companyEntry as SAGAKAYAK_ENTRY } from './sagakayak/company'
import { companyEntry as SAUDAKOFINN_ENTRY } from './saudakofinn/company'
import { companyEntry as LJOMALIND_ENTRY } from './ljomalind/company'
import { companyEntry as BJARKALUNDUR_ENTRY } from './bjarkalundur/company'
import { companyEntry as KAUPTUN_ENTRY } from './kauptun/company'
import { companyEntry as ISSI_ENTRY } from './issi/company'
import { companyEntry as HUNABUD_ENTRY } from './hunabud/company'
import { companyEntry as KIDKA_ENTRY } from './kidka/company'
import { companyEntry as DRANGAR_ENTRY } from './drangar/company'
import { companyEntry as ILL_ENTRY } from './icelandluxurylodges/company'
import { companyEntry as MIRRORLODGE_ENTRY } from './mirrorlodge/company'
import { companyEntry as MIRRORSUITE_ENTRY } from './mirrorsuite/company'
import { companyEntry as BUDIR_ENTRY } from './budir/company'
import { companyEntry as BILAS_ENTRY } from './bilas/company'
import { companyEntry as SJAVARBORG_ENTRY } from './sjavarborg/company'
import { companyEntry as BRAGDAVELLIR_ENTRY } from './bragdavellir/company'
import { companyEntry as ALRUN_ENTRY } from './alrun/company'
import { companyEntry as SKALAKOT_ENTRY } from './skalakot/company'
import { companyEntry as HEKLUSYN_ENTRY } from './heklusyn/company'
import { companyEntry as THG_ENTRY } from './thg/company'
import { companyEntry as TANNLAEKNAVAKTIN_ENTRY } from './tannlaeknavaktin/company'
import { companyEntry as KIROPRAKTORSTOFAN_ENTRY } from './kiropraktorstofan/data'
import { COMPANY_ENTRY as HUNDAHOTELID_ENTRY } from './hundahotelid/data'
import { GITARINN as GITARINN_ENTRY } from './gitarinn/data'
import { COMPANY as EIGNAMIDLUN_ENTRY } from './eignamidlun/data'
import { sjukrathjalfarinnCompany as SJUKRATHJALFARINN_ENTRY } from './sjukrathjalfarinn/data'
import { FOSSATUN_ENTRY } from './fossatun/data'
import { HOFDABILAR_ENTRY } from './hofdabilar/data'
import { companyEntry as LAXA_ENTRY } from './laxa/data'
import { companyEntry as HUSAVIK_ENTRY } from './husavik/data'
import { companyEntry as WESTFJORDS_ENTRY } from './westfjords/data'
import { companyEntry as LISTAK_ENTRY } from './listak/data'
import { companyEntry as MINJASAFN_ENTRY } from './minjasafn/data'
import { companyEntry as ASLAUGSAJA_ENTRY } from './aslaugsaja/data'
import { companyEntry as SIGTRYGGUR_ENTRY } from './sigtryggur/data'
import { companyEntry as MIRRORHOUSE_ENTRY } from './mirrorhouse/data'
import { companyEntry as LAKEVIEW_ENTRY } from './lakeview/data'
import { companyEntry as MYSTICLIGHT_ENTRY } from './mysticlight/data'
import { companyEntry as VILLANORTH_ENTRY } from './villanorth/data'
import { companyEntry as LAXFOSS_ENTRY } from './laxfoss/data'
import { companyEntry as GLASSHOUSE_ENTRY } from './glasshouse/data'
import { companyEntry as SVARTABORG_ENTRY } from './svartaborg/data'
import { companyEntry as RAKARARNIR_ENTRY } from './rakararnir/company'
import { companyEntry as GLASSCOTTAGES_ENTRY } from './glasscottages/data'

export const PREVIEW_COMPANIES: PreviewCompany[] = [
  ERPSSTADIR_ENTRY,
  TJORUHUSID_ENTRY,
  EKTAFISKUR_ENTRY,
  KAFFIHORNID_ENTRY,
  SEAKAYAK_ENTRY,
  WEIDER_ENTRY,
  AUSTRI_ENTRY,
  LYSULAUGAR_ENTRY,
  HESPA_ENTRY,
  REYKKOFINN_ENTRY,
  GALDRASYNING_ENTRY,
  SAUDARKROKSBAKARI_ENTRY,
  REYKJAVIKDISTILLERY_ENTRY,
  BEFFATOURS_ENTRY,
  KOGGA_ENTRY,
  HAAFELL_ENTRY,
  POLARHESTAR_ENTRY,
  EYJATOURS_ENTRY,
  FISCHERSETUR_ENTRY,
  EDINBORG_ENTRY,
  BRUNASTADIR_ENTRY,
  GLACIERPARADISE_ENTRY,
  SIREKSSTADIR_ENTRY,
  CAVESOFHELLA_ENTRY,
  GAMLAFJOSID_ENTRY,
  FAXIBAKERY_ENTRY,
  GKBAKARI_ENTRY,
  KIRKJUBAER_ENTRY,
  VINLAND_ENTRY,
  VELLIR_ENTRY,
  HEITIRPOTTAR_ENTRY,
  SPORTSOL_ENTRY,
  SAELAN_ENTRY,
  STJORNUSOL_ENTRY,
  PASSION_ENTRY,
  REYNIR_ENTRY,
  RAKARASTOFA_ENTRY,
  ARSOL_ENTRY,
  STRYTAN_ENTRY,
  SEIDKARLINN_ENTRY,
  BILAGEIRINN_ENTRY,
  PRENTVERK_ENTRY,
  GEISLI_ENTRY,
  PIPULAGNIR_ENTRY,
  SMARIHOLM_ENTRY,
  SAMVERK_ENTRY,
  HUDFLUR_ENTRY,
  UNA_ENTRY,
  FOTOGRAFI_ENTRY,
  FUZZY_ENTRY,
  ELFA_ENTRY,
  SELJAVELLIR_ENTRY,
  LANGAHOLT_ENTRY,
  FISKKOMPANI_ENTRY,
  NAUSTID_ENTRY,
  ALFACAFE_ENTRY,
  SETBERG_ENTRY,
  NYPUGARDAR_ENTRY,
  LITLAHOF_ENTRY,
  SAGAKAYAK_ENTRY,
  SAUDAKOFINN_ENTRY,
  LJOMALIND_ENTRY,
  BJARKALUNDUR_ENTRY,
  KAUPTUN_ENTRY,
  ISSI_ENTRY,
  HUNABUD_ENTRY,
  KIDKA_ENTRY,
  DRANGAR_ENTRY,
  ILL_ENTRY,
  MIRRORLODGE_ENTRY,
  MIRRORSUITE_ENTRY,
  BUDIR_ENTRY,
  BILAS_ENTRY,
  SJAVARBORG_ENTRY,
  BRAGDAVELLIR_ENTRY,
  ALRUN_ENTRY,
  SKALAKOT_ENTRY,
  HEKLUSYN_ENTRY,
  THG_ENTRY,
  TANNLAEKNAVAKTIN_ENTRY,
  KIROPRAKTORSTOFAN_ENTRY,
  HUNDAHOTELID_ENTRY,
  GITARINN_ENTRY,
  EIGNAMIDLUN_ENTRY,
  SJUKRATHJALFARINN_ENTRY,
  FOSSATUN_ENTRY,
  HOFDABILAR_ENTRY,
  LAXA_ENTRY,
  HUSAVIK_ENTRY,
  WESTFJORDS_ENTRY,
  LISTAK_ENTRY,
  MINJASAFN_ENTRY,
  ASLAUGSAJA_ENTRY,
  SIGTRYGGUR_ENTRY,
  MIRRORHOUSE_ENTRY,
  LAKEVIEW_ENTRY,
  MYSTICLIGHT_ENTRY,
  VILLANORTH_ENTRY,
  LAXFOSS_ENTRY,
  GLASSHOUSE_ENTRY,
  SVARTABORG_ENTRY,
  RAKARARNIR_ENTRY,
  GLASSCOTTAGES_ENTRY,
]

export function getPreviewCompany(slug: string): PreviewCompany {
  const c = PREVIEW_COMPANIES.find((x) => x.slug === slug)
  if (!c) throw new Error(`Unknown preview slug: ${slug}`)
  return c
}
