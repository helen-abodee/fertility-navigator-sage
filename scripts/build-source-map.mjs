/**
 * Generates content/SOURCE-MAP.csv: every area of the product, what it shows
 * or asks, and the source behind it. For Helen's stakeholder deck.
 * Run after `npx next build` is NOT needed; this reads content via tsx-less
 * dynamic import of the compiled test bundle, so instead we keep it simple:
 * node scripts/build-source-map.mjs uses the JSON table + hand-maintained rows
 * for TS content.
 */
console.log("See tests/source-map.gen.test.ts: WRITE_SOURCE_MAP=1 npx vitest run tests/source-map.gen.test.ts");
