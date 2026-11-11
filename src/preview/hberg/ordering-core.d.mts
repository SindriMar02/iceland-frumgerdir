export type OrderLine = {
  slug: string;
  magn: number;
  unit: string;
  other?: string;
};
export type Remembered = {
  company: Record<string, string>;
  orders: { date: string; lines: OrderLine[] }[];
};
export const REMEMBER_KEY: string;
export function validKennitala(value: string): boolean;
export function cleanLines(lines: unknown): OrderLine[];
export function readRemember(storage: Storage): Remembered | null;
export function saveRemember(
  storage: Storage,
  company: Record<string, string>,
  lines: OrderLine[],
  date?: string,
): Remembered | null;
export function forgetRemember(storage: Storage): boolean;
export function repeatOrder(
  order: Remembered["orders"][number],
  allowed: string[],
): OrderLine[];
export function formatKennitala(value: string): string;
export function countWord(n: number, one: string, many: string): string;
export function orderTotals(lines: OrderLine[]): string;

export function nextAmountSlug(
  slugs: string[],
  current: string,
  backwards?: boolean,
): string | null;
export function lineDescription(line: OrderLine): string;
export function buildOrderText(
  company: Record<string, string>,
  lines: OrderLine[],
  titles: Record<string, string>,
  labels: { key: string; label: string }[],
  orderNote?: string,
): string;
export function nextWorkingDays(value: string, count?: number): string[];
