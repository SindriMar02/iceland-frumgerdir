// Pure rules shared by the order window and its Node checks.
export const REMEMBER_KEY = "hberg-pantanir-v1";
export function validKennitala(value) {
  const s = String(value)
    .trim()
    .replace(/^(\d{6})-(\d{4})$/, "$1$2");
  if (!/^\d{10}$/.test(s) || !/[089]/.test(s[9])) return false;
  const n = [...s].map(Number);
  const day = n[0] * 10 + n[1];
  const d = day > 40 ? day - 40 : day;
  const month = n[2] * 10 + n[3];
  const year = { 8: 1800, 9: 1900, 0: 2000 }[n[9]] + n[4] * 10 + n[5];
  const date = new Date(Date.UTC(year, month - 1, d));
  if (d < 1 || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== d)
    return false;
  const check =
    (11 -
      (n
        .slice(0, 8)
        .reduce(
          (sum, digit, i) => sum + digit * [3, 2, 7, 6, 5, 4, 3, 2][i],
          0,
        ) %
        11)) %
    11;
  return check !== 10 && check === n[8];
}
export function cleanLines(lines) {
  if (!Array.isArray(lines)) return [];
  const seen = new Set();
  return lines
    .filter(
      (l) =>
        l &&
        typeof l.slug === "string" &&
        Number.isInteger(l.magn) &&
        l.magn > 0 &&
        l.magn <= 9999 &&
        typeof l.unit === "string" &&
        !seen.has(l.slug) &&
        seen.add(l.slug),
    )
    .map((l) => ({
      slug: l.slug,
      magn: l.magn,
      unit: l.unit,
      ...(typeof l.other === "string" ? { other: l.other.slice(0, 240) } : {}),
    }));
}
export function readRemember(storage) {
  try {
    const v = JSON.parse(storage.getItem(REMEMBER_KEY) || "null");
    if (
      !v ||
      typeof v.company !== "object" ||
      !v.company ||
      !Array.isArray(v.orders)
    )
      return null;
    return {
      company: Object.fromEntries(
        Object.entries(v.company).filter(([, v]) => typeof v === "string"),
      ),
      orders: v.orders
        .filter(
          (o) =>
            o &&
            typeof o.date === "string" &&
            Number.isFinite(Date.parse(o.date)) &&
            Array.isArray(o.lines),
        )
        .slice(0, 5)
        .map((o) => ({ date: o.date, lines: cleanLines(o.lines) })),
    };
  } catch {
    return null;
  }
}
export function saveRemember(
  storage,
  company,
  lines,
  date = new Date().toISOString(),
) {
  try {
    const old = readRemember(storage);
    const value = {
      company,
      orders: [
        { date, lines: cleanLines(lines) },
        ...(old?.orders || []),
      ].slice(0, 5),
    };
    storage.setItem(REMEMBER_KEY, JSON.stringify(value));
    return value;
  } catch {
    return null;
  }
}
export function forgetRemember(storage) {
  try {
    storage.removeItem(REMEMBER_KEY);
    return true;
  } catch {
    return false;
  }
}
export function repeatOrder(order, allowed) {
  return cleanLines(order?.lines)
    .filter((l) => allowed.includes(l.slug))
    .map((l) => ({ ...l }));
}
export function formatKennitala(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 10);
  return digits.length > 6
    ? `${digits.slice(0, 6)}-${digits.slice(6)}`
    : digits;
}
export function countWord(n, one, many) {
  return n % 10 === 1 && n % 100 !== 11 ? one : many;
}
export function orderTotals(lines) {
  const amounts = new Map();
  for (const line of lines)
    amounts.set(line.unit, (amounts.get(line.unit) || 0) + line.magn);
  return [
    `${lines.length} ${countWord(lines.length, "vara", "vörur")}`,
    ...[...amounts]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([unit, n]) =>
          `${n} ${unit === "kassar" ? countWord(n, "kassi", "kassar") : unit === "pokar" ? countWord(n, "poki", "pokar") : unit === "annad" ? "aðrar einingar" : unit.replace(/^pokar/, countWord(n, "poki", "pokar"))}`,
      ),
  ].join(" · ");
}

// The visible catalogue order is the keyboard entry order, including active filters.
export function nextAmountSlug(slugs, current, backwards = false) {
  const index = slugs.indexOf(current);
  return index < 0 ? null : slugs[index + (backwards ? -1 : 1)] || null;
}
export function lineDescription(line) {
  const unit =
    line.unit === "kassar"
      ? countWord(line.magn, "kassi", "kassar")
      : line.unit === "pokar"
        ? countWord(line.magn, "poki", "pokar")
        : line.unit === "annad"
          ? "aðrar einingar"
          : line.unit;
  return `${line.magn} ${unit}${line.unit === "annad" && line.other ? ` · ${line.other}` : ""}`;
}
export function buildOrderText(company, lines, titles, labels, orderNote = "") {
  return [
    "Pöntun til H-Berg",
    "",
    ...labels.map((f) => `${f.label}: ${company[f.key] || ""}`),
    `Athugasemd um afhendingu: ${company.note || ""}`,
    `Óskir um pöntun: ${orderNote}`,
    "",
    "Vörur:",
    ...lines.map((l) => `${titles[l.slug] || l.slug} · ${lineDescription(l)}`),
  ].join("\n");
}
export function nextWorkingDays(value, count = 3) {
  const date = new Date(`${value}T12:00:00`),
    days = [];
  while (days.length < count) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6)
      days.push(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      );
  }
  return days;
}
