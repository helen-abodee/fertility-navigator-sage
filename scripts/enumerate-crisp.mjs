/**
 * Enumerates UCSD's public CRISP tool (oncofertilityrisk.com) over its own
 * AJAX API: every cancer type x exposure type x treatment, at four ages, to
 * recover the full regimen -> risk mapping plus the literature reference each
 * output cites. Polite: sequential, ~0.8s between requests, identified UA.
 *
 * Output: content/sources/crisp/enumeration.json (full provenance per row).
 * Run: node scripts/enumerate-crisp.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";

const BASE = "https://oncofertilityrisk.com/wp-admin/admin-ajax.php";
const UA = "Mozilla/5.0 (research enumeration for a nonprofit oncofertility education tool; contact via UCSD collaboration)";
const AGES = process.env.CRISP_AGES
  ? process.env.CRISP_AGES.split(",").map(Number)
  : [20, 30, 38, 44];
const DELAY_MS = 800;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function post(params, retries = 3) {
  const body = new URLSearchParams();
  for (const [k, v] of params) body.append(k, v);
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (res.ok) return await res.json();
      if (res.status === 429 || res.status >= 500) {
        await sleep(5000 * (i + 1));
        continue;
      }
      return null;
    } catch {
      await sleep(5000 * (i + 1));
    }
  }
  return null;
}

function parseResult(htmlStr) {
  const text = htmlStr
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const band = (text.match(/Estimated Infertility Risk is\s+(LOW|MODERATE|HIGH|UNKNOWN)/i) || [])[1] || null;
  const pct = (text.match(/Risk based on your treatment:\s*([\d.]+\s*[-–to ]*\s*[\d.]*\s*%)/i) || [])[1] || null;
  const outcome = (text.match(/([\d.]+\s*[-–]\s*[\d.]+%|[\d.]+%)\s*risk of ([A-Za-z ()0-9]+?)(?: Low risk| Moderate risk| High risk| Unknown risk|$)/) || [])[2] || null;
  const refsIdx = text.indexOf("References:");
  const refs = refsIdx >= 0 ? text.slice(refsIdx + 11).replace(/Date Prepared:.*$/, "").trim() : null;
  return { band, pct, outcome: outcome ? outcome.trim() : null, refs, raw: text.slice(0, 2000) };
}

async function main() {
  const retrieved = new Date().toISOString().slice(0, 10);
  const out = { retrieved, source: "https://oncofertilityrisk.com/en/infertility/", ages: AGES, cancers: {}, rows: [], errors: [] };

  const formData = await post([["action", "get_form_data"], ["language", "en"]]);
  if (!formData) throw new Error("get_form_data failed");
  await sleep(DELAY_MS);

  const cancers = formData.cancer_types;
  const exposures = formData.exposure_types;
  out.cancers = { cancer_types: cancers, exposure_types: exposures };

  for (const cancer of cancers) {
    for (const exposure of exposures) {
      const listing = await post([
        ["action", "submit_form"],
        ["age", "24"],
        ["cancer_type", cancer.id],
        ["exposure_types[]", exposure.id],
        ["language", "en"],
      ]);
      await sleep(DELAY_MS);
      const treatments = listing && listing.drug_treatments ? Object.keys(listing.drug_treatments) : [];
      if (treatments.length === 0) continue;
      console.log(`${cancer.id} x ${exposure.id}: ${treatments.length} treatments`);

      for (const treatment of treatments) {
        const perAge = {};
        for (const age of AGES) {
          const res = await post([
            ["action", "get_results"],
            ["age", String(age)],
            ["cancer_type", cancer.id],
            ["exposure_types[]", exposure.id],
            ["drug_treatments[]", treatment],
            ["language", "en"],
          ]);
          await sleep(DELAY_MS);
          if (!res || !res.html) {
            out.errors.push({ cancer: cancer.id, exposure: exposure.id, treatment, age, error: res ? res.error || "no html" : "request failed" });
            continue;
          }
          perAge[age] = parseResult(res.html);
        }
        // Collapse when identical across ages.
        const keys = Object.keys(perAge);
        const first = keys.length ? JSON.stringify({ b: perAge[keys[0]].band, p: perAge[keys[0]].pct }) : null;
        const ageDependent = keys.some((k) => JSON.stringify({ b: perAge[k].band, p: perAge[k].pct }) !== first);
        out.rows.push({
          cancer: cancer.name,
          cancerId: cancer.id,
          exposure: exposure.name,
          exposureId: exposure.id,
          treatment,
          ageDependent,
          results: perAge,
        });
      }
    }
  }

  mkdirSync("content/sources/crisp", { recursive: true });
  writeFileSync(process.env.CRISP_OUT || "content/sources/crisp/enumeration.json", JSON.stringify(out, null, 1));
  console.log(`DONE: ${out.rows.length} treatment rows, ${out.errors.length} errors`);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
