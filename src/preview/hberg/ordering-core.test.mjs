import assert from "node:assert/strict";
import {
  formatKennitala,
  countWord,
  orderTotals,
  validKennitala,
  readRemember,
  saveRemember,
  repeatOrder,
  forgetRemember,
  REMEMBER_KEY,
} from "./ordering-core.mjs";
assert.equal(validKennitala("540269-6029"), true);
assert.equal(validKennitala("5402696029"), true);
for (const value of [
  "540269-6039",
  "123456-7890",
  "",
  "540269602",
  "54026960299",
  "0000000000",
  "540269x6029",
])
  assert.equal(validKennitala(value), false, value);
const data = new Map();
const storage = {
  getItem: (k) => data.get(k) ?? null,
  setItem: (k, v) => data.set(k, v),
  removeItem: (k) => data.delete(k),
};
assert.equal(readRemember(storage), null);
const company = { company: "Prófun ehf.", kt: "5402696029" };
const lines = [{ slug: "mondlur", magn: 3, unit: "kassar" }];
saveRemember(storage, company, lines, "2026-11-11T12:00:00Z");
const last = readRemember(storage);
assert.deepEqual(last.company, company);
assert.deepEqual(last.orders[0].lines, lines);
const filled = repeatOrder(last.orders[0], ["mondlur"]);
assert.deepEqual(filled, lines);
filled[0].magn = 9;
assert.equal(last.orders[0].lines[0].magn, 3);
assert.deepEqual(repeatOrder(last.orders[0], []), []);
for (let i = 0; i < 6; i++)
  saveRemember(storage, company, [{ ...lines[0], magn: i + 1 }]);
assert.equal(readRemember(storage).orders.length, 5);
assert.equal(readRemember(storage).orders[0].lines[0].magn, 6);
forgetRemember(storage);
assert.equal(data.has(REMEMBER_KEY), false);
const blocked = {
  getItem() {
    throw Error();
  },
  setItem() {
    throw Error();
  },
  removeItem() {
    throw Error();
  },
};
assert.equal(readRemember(blocked), null);
assert.equal(saveRemember(blocked, company, lines), null);
assert.equal(forgetRemember(blocked), false);
storage.setItem(REMEMBER_KEY, "{broken");
assert.equal(readRemember(storage), null);
console.log(
  "PASS kennitala valid, formatted, invalid checksum, malformed and date examples",
);
console.log(
  "PASS remember save, read last, repeat editable copy, unknown products, last five, forget, blocked and corrupt storage",
);
assert.equal(formatKennitala("5402696029"), "540269-6029");
assert.equal(formatKennitala("540269-6029"), "540269-6029");
assert.equal(formatKennitala("54a02696029999"), "540269-6029");
for (let i = 0; i <= 10; i++)
  assert.equal(
    formatKennitala("5402696029".slice(0, i)),
    i > 6 ? "540269-" + "6029".slice(0, i - 6) : "540269".slice(0, i),
  );
assert.equal(orderTotals([]), "0 vörur");
assert.equal(
  orderTotals([{ slug: "a", magn: 1, unit: "kassar" }]),
  "1 vara · 1 kassi",
);
assert.equal(
  orderTotals([
    { slug: "a", magn: 7, unit: "kassar" },
    { slug: "b", magn: 8, unit: "kassar" },
    { slug: "c", magn: 1, unit: "pokar" },
  ]),
  "3 vörur · 15 kassar · 1 poki",
);
assert.equal(
  orderTotals([{ slug: "a", magn: 11, unit: "pokar" }]),
  "1 vara · 11 pokar",
);
assert.equal(countWord(21, "vara", "vörur"), "vara");
assert.equal(countWord(11, "vara", "vörur"), "vörur");
assert.equal(countWord(111, "kassi", "kassar"), "kassar");
assert.equal(countWord(101, "poki", "pokar"), "poki");
console.log(
  "PASS kennitala formatter at every typing length, pasted formatting, non digits and maximum length",
);
console.log(
  "PASS totals empty, singular, plural, mixed units and Icelandic 11 / 21 / 101 / 111 forms",
);

const {
  cleanLines,
  buildOrderText,
  nextAmountSlug,
  nextWorkingDays,
  lineDescription,
} = await import("./ordering-core.mjs");
const custom = [
  { slug: "mondlur", magn: 2, unit: "annad", other: "Blandað í kassa" },
];
assert.deepEqual(cleanLines(custom), custom);
saveRemember(storage, company, custom);
assert.deepEqual(
  repeatOrder(readRemember(storage).orders[0], ["mondlur"]),
  custom,
);
assert.equal(cleanLines([{ ...custom[0], other: 42 }])[0].other, undefined);
assert.equal(
  cleanLines([{ ...custom[0], other: "a".repeat(300) }])[0].other.length,
  240,
);
const mail = buildOrderText(
  { ...company, note: "Nota hliðarinngang" },
  custom,
  { mondlur: "Möndlur" },
  [{ key: "company", label: "Fyrirtæki" }],
  "Hringið ef vara vantar",
);
assert.ok(mail.includes("Óskir um pöntun: Hringið ef vara vantar"));
assert.ok(mail.includes("Athugasemd um afhendingu: Nota hliðarinngang"));
assert.ok(mail.includes("Möndlur · 2 aðrar einingar · Blandað í kassa"));
assert.equal(lineDescription(custom[0]), "2 aðrar einingar · Blandað í kassa");
assert.equal(nextAmountSlug(["b", "a", "c"], "b"), "a");
assert.equal(nextAmountSlug(["b", "a", "c"], "a", true), "b");
assert.equal(nextAmountSlug(["b", "c"], "b"), "c");
assert.equal(nextAmountSlug(["b", "a", "c"], "c"), null);
assert.equal(nextAmountSlug(["b", "a", "c"], "b", true), null);
assert.equal(nextAmountSlug(["a"], "missing"), null);
assert.deepEqual(nextWorkingDays("2026-11-13"), [
  "2026-11-16",
  "2026-11-17",
  "2026-11-18",
]);
assert.deepEqual(nextWorkingDays("2026-12-31"), [
  "2027-01-01",
  "2027-01-04",
  "2027-01-05",
]);
console.log(
  "PASS Annað draft/history/repeat persistence, invalid text sanitization and length bound",
);
console.log(
  "PASS custom line text, order note and separate delivery note in production mail builder",
);
console.log(
  "PASS fast entry catalogue/filter order, reverse and both boundaries; weekday chips over weekend and year boundary",
);
