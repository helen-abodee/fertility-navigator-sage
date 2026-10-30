# Clinic dataset provenance (workstream D)

How every record in `data/clinics.json` was gathered. All web facts were retrieved **2026-10-30**.

## Method

1. **Seed list.** All 16 entries on the City of Hope patient flyer "Fertility Resources List" (source-docs/estella/Fertility Resources List.pdf, sourceId **D1**, ref 20000-NEW-38076), plus HRC Fertility's other Southern California offices (per the task brief) and the UC San Diego fertility preservation / Moores Cancer Center oncofertility program.
2. **recommendedBy.** The `recommendedBy.value` for each flyer entry is the flyer's own description, transcribed VERBATIM from the PDF (page noted in the citation). These are the flyer's words, not ours; no endorsement language was added. The UCSD record has no `recommendedBy` because it is not on the flyer.
3. **Live-site verification.** Every other field (name, website, phone, locations, services, oncofertility / ovarian tissue freezing / sperm banking booleans, prices, consult cost, insurance, financing) was extracted from the organization's **own public website** on 2026-10-30. Each `SourcedField` carries the URL of the specific page the value came from. Third-party aggregators (FertilityIQ, Yelp, etc.) were never used for prices, insurance, or financing; search engines were used only to locate official pages.
4. **"not_published" rule.** Where a site prints no prices / consult cost / insurer list / financing programs, the value is the literal string `"not_published"`. Nothing was estimated or copied from third parties. For two sites that blocked automated fetching (see below), fields that could not be verified are also `"not_published"` — absence of evidence, not evidence of absence.
5. **Booleans.** `oncofertility`, `ovarianTissueFreezing`, `spermBanking` are `true` only where the site explicitly says so (source page in `sourceUrl`). They are `false` only where the relevant services/preservation page was read and the service is not mentioned. Where the site could not be read at all, the value is `"not_published"`.
6. **Geocoding.** Street addresses were geocoded with the free OpenStreetMap Nominatim API (`https://nominatim.openstreetmap.org/search?format=json&q=...`), one request per second, with a descriptive User-Agent. Suite numbers were dropped from queries (kept in the stored address strings). Failures and fallbacks are listed below.

## Closed / renamed / moved organizations (flagged)

- **California Fertility Partners → Pinnacle Fertility Los Angeles.** The flyer prints a typo URL ("califroniafertilitypartners.com"); the correct domain `californiafertilitypartners.com` now 301-redirects to https://www.pinnaclefertility.com/location/los-angeles-ca/, whose page says "Formerly California Fertility Partners" (acquired by Pinnacle Fertility, March 2022; see https://www.prnewswire.com/news-releases/california-fertility-partners-acquired-by-pinnacle-fertility-the-nations-fastest-growing-physician-centric-family-building-platform-301506194.html).
- **USC Fertility → part of HRC Fertility (2021).** Verified on the official Keck Medicine of USC provider page https://www.keckmedicine.org/provider/richard-j-paulson/: "In 2021, USC Fertility became part of HRC Fertility and the practice is now located in Pasadena" at 55 S. Lake Ave., 9th Floor, Pasadena (the same address as HRC Pasadena). Keck Medicine separately operates the "USC Fertility and Men's Sexual Health Center" in Beverly Hills (https://www.keckmedicine.org/centers-and-programs/male-infertility/).
- **The Oncofertility Consortium moved from Northwestern to Michigan State University.** The flyer URL oncofertility.northwestern.edu returns a 301 redirect to oncofertility.msu.edu (verified 2026-10-30). Record uses the MSU site.
- **fertile-future.com (California Cryobank's oncofertility site) is gone.** It now 301-redirects to https://www.cryobank.com/about-us/contact-us/; the old Fertile Future brochure PDF returns 404. The record uses cryobank.com. California Cryobank's own spermbank.com locations page notes its Orange County, CA and Jacksonville, FL locations are closed; only the Los Angeles donation center is recorded.
- **reproductivefertilitycenter.com → rfcfamily.com.** 301 redirect observed 2026-10-30; still branded "Reproductive Fertility Center".
- **UCLA flyer URL broken.** obgyn.ucla.edu/fertility fails with an expired TLS certificate; the live page is https://www.uclahealth.org/medical-services/obgyn/fertility ("Fertility & Reproductive Health").

## Sites that blocked fetching (fields left "not_published")

- **uscfertility.org** returned HTTP 500 on every attempt (homepage and four subpages, 2 attempts each, 2026-10-30). The USC Fertility record is built from official Keck Medicine of USC pages instead; prices/insurance/financing are `"not_published"` because of the block, not confirmed absence. `ovarianTissueFreezing` is `"not_published"` for the same reason.
- **westernfertility.com** returned HTTP 403 Forbidden on all attempts (homepage, /contact-us/, /faq/, new.westernfertility.com). Nothing could be verified on-site, so `services`, all booleans, and all price/insurance/financing fields are `"not_published"` and `locations` is empty. Search-index snippets of the site (NOT verified, NOT stored in the dataset) showed Encino and Arcadia offices. The phone stored in the record, (888) 261-4574, is the number printed on the D1 flyer, kept because it is the only sourced value available; it could not be re-verified against the live site.
- **oncofertility.msu.edu** returned blank content to the fetcher (likely JS-rendered). The flyer URL's 301 redirect to this domain WAS directly observed. The `services` list comes from search-engine-indexed text of the official /about page — flagged here as the one place a cached copy of an official page (not a third party) was used. A phone number appears in third-party directories only, so the record has no phone.
- **savemyfertility.org** returned blank content on 4 attempts across 3 URLs (likely JS-rendered or bot-blocked). The domain is live; the services/oncofertility fields are based on its indexed official pocket-guide pages (URLs in the record). All other fields `"not_published"`. The phone stored in the record, (312) 503-2504, is the number printed on the D1 flyer; it could not be re-verified against the live site.
- **pinnaclefertility.com/affording-care/egg-freezing-cost/** returned HTTP 403 (rest of the site readable); Pinnacle LA prices stay `"not_published"` — the readable "Affording Care" pages print no dollar amounts.

## Non-clinic entries (kept per task brief, with honest `services`)

- **California Cryobank** — a sperm/egg bank, not a treatment clinic. `oncofertility` is `false` under the strict rule: the live site's sperm-banking-101 page has a "Fertility preservation" section that links out to Livestrong Fertility, but no live page explicitly describes CCB fertility preservation for cancer patients.
- **Livestrong Fertility** — a nonprofit financial-assistance/education program, not a clinic. It brokers discounted preservation at 150+ partner clinics; it performs no procedures, so the procedure booleans are `false`. Its Austin, TX foundation office is deliberately NOT stored as a location (it is not a place patients receive care, and would distort distance calculations). Its page cites typical market costs (~$12,000 birthing parent / ~$700 non-birthing parent) as context, not prices it charges, so `publishedPrices` is `"not_published"`.
- **The Oncofertility Consortium** — a national research network/resource with a clinic locator; no procedures, no patient locations.
- **SaveMyFertility** — an online education resource (pocket guides); no procedures, no locations.

## Pricing notes

- Only **five** organizations (four clinics plus the cryobank) print any prices on their own sites: **California Cryobank** (donor vial, reserve, storage, shipping and fee schedule — vial-pricing and shipping-storage pages), **CARE Fertility** (full package price list on /pricing/, including Egg Freezing $6,500), **The Center for Fertility and Gynecology** (IVF/egg-freezing price list on /services/ivf/cost/), **Loma Linda University Center for Fertility & IVF** (egg retrieval ~$6,000 on /treatments/cryopreservation/egg-freezing/, sperm storage $220–500/yr on /treatments/cryopreservation/sperm/, storage $400–$1,200/yr on /treatments/cryopreservation/), and **Reproductive Fertility Center** (All-Inclusive IVF Package $28,000 on /specials/all-inclusive-ivf-package/).
- Loma Linda's price strings name their specific source page in parentheses because they come from three different pages; the field-level `sourceUrl` is the egg-freezing page.
- Pacific Reproductive Center's cost page prints only **national averages** ($15,000–$20,000 US average IVF), not PRC prices, and the homepage shows a "$3,000 off egg freezing" promo (a discount, not a price) — both excluded; `publishedPrices` is `"not_published"`.
- HRC Fertility names packages (Nest, Stork, Dream Plus) but prints no dollar amounts anywhere found (affording-treatment and package pages checked), so `"not_published"`.

## Per-record source summary

| Record | Facts from | Notes |
|---|---|---|
| california-cryobank | cryobank.com (services, sperm-banking-101, pricing pages), spermbank.com/locations (own sibling domain, LA address) | bank, not clinic; fertile-future.com dead |
| pinnacle-fertility-los-angeles | pinnaclefertility.com (location, cancer-fertility-support, affording-care pages) | formerly California Fertility Partners; offers ovarian tissue freezing |
| care-fertility | carefertility.net (home, fertility-preservation, pricing) | SoCal practice, NOT the UK chain; free consultations on pricing page |
| center-for-fertility-and-gynecology | center4fertility.com (home, locations, fertility-preservation, ivf/cost) | explicit ovarian tissue freezing; Bakersfield office included (on their official locations page) |
| hrc-fertility | havingbabies.com (locations, fertility-treatments, fertility-preservation, insurance-coverage, affording-treatment) | 12 SoCal offices stored; Las Vegas/San Francisco/Foster City offices excluded as outside SoCal |
| innovative-fertility-center | innovativefertility.com (home, fertility-treatments, oncofertility, insurance, financing pages) | spermBanking false: site offers information/referral only |
| livestrong-fertility | livestrong.org/we-can-help/livestrong-fertility | nonprofit program; flyer URL still current |
| loma-linda-university-center-for-fertility-ivf | lomalindafertility.com (contact, cryopreservation pages, insurance-benefits, how-much-does-ivf-cost) | OTC page is educational only ("experimental" per ASRM), so false; IEHP and Medi-Cal not accepted for infertility services |
| oc-fertility | ocfertility.com (home, fertility-preservation service page, cancer article, financial-guide) | now branded "OC Fertility + OC Biogenix", still independent; Progyny NOT accepted |
| oncofertility-consortium | oncofertility.msu.edu (via redirect; /about via search index — see blocks) | moved to MSU |
| pacific-reproductive-center | pacificreproductivecenter.com (home, egg-freezing, male-infertility, ivf/cost) | spermBanking false: site advises patients to ask "their treatment provider" about it |
| reproductive-fertility-center | rfcfamily.com (home, locations, services, oncofertility page, financial-information, specials) | domain renamed from reproductivefertilitycenter.com |
| savemyfertility | savemyfertility.org (blocked; indexed official pocket-guide pages) | education resource |
| ucla-fertility-and-reproductive-health | uclahealth.org (fertility service page, Westwood + Santa Monica location pages) | flyer URL obgyn.ucla.edu/fertility has expired certificate |
| usc-fertility | keckmedicine.org (Paulson provider page, male-infertility center page); uscfertility.org blocked | became part of HRC Fertility in 2021 |
| western-fertility-institute | westernfertility.com (blocked on every page) | all substantive fields not_published; phone from D1 flyer |
| uc-san-diego-health-fertility-preservation | health.ucsd.edu (/care/fertility/, /care/cancer/fertility-preservation-counseling/, /locations/) | explicit ovarian tissue banking, sperm banking, testicular tissue banking; IVF via partnership with Reproductive Partners Fertility Center–San Diego; fertility clinic street address not printed on fertility pages, so only the Moores Cancer Center address is stored |

## Geocoding results

All coordinates from OpenStreetMap Nominatim, retrieved 2026-10-30, queried without suite numbers at 1 request/second.

- **33 of 36 addresses** geocoded to a street-level match on the first pass.
- **UCSD Moores Cancer Center** (3855 Health Sciences Drive) failed with the "La Jolla, CA 92037" spelling but matched exactly on retry as "3855 Health Sciences Drive, San Diego, California" (32.8785692, -117.219076) — a real match, not a fallback.
- **HRC Fullerton** (1950 Sunnycrest Dr #2400, Fullerton, CA 92835): no Nominatim match under any query variant. **Fallback: Fullerton city-center coordinate** (33.8708215, -117.929416) is stored. Distance calculations for this office are approximate.
- **HRC Westlake Village** (1220 La Venta Dr #103, Westlake Village, CA 91361): no Nominatim match under any query variant. **Fallback: Westlake Village city-center coordinate** (34.1460234, -118.8061794) is stored. Distance calculations for this office are approximate.
- USC Fertility's Pasadena location reuses the geocode of the identical HRC Pasadena address (55 S. Lake Ave); its Beverly Hills address was geocoded without a suite/zip (the Keck page did not print one).
- Records with no stored locations (and therefore nothing geocoded): Livestrong Fertility (nonprofit; its Austin, TX foundation office is not a care location), The Oncofertility Consortium, SaveMyFertility (online resources), and Western Fertility Institute (site blocked; no address could be verified).
