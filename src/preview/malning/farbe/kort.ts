import { HAMARK_DROPA, LITEFNI } from './pigment.ts';
import type { Dropar } from './pigment.ts';

export type Uppskrift = { dropar: Dropar; vara: number; gljai: number; litrar: number };
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// MSB first: 8 zero pad bits | six 6-bit drops in LITEFNI order | vara:6 | gljai:2 | litrar:3 | CRC:5.
// 47 payload + 5 CRC bits fit exactly in Number; encode leading zeros rather than storing 60 bits.
// CRC polynomial x^5+x^2+1, MSB-first, init=31, xorout=31, over exactly 47 payload bits.
// Missing drops encode as zero; decoding materializes all six keys.
function checksum(payload: number): number {
  let crc = 31;
  for (let bit = 46; bit >= 0; bit--) {
    const feedback = (crc >>> 4) ^ (Math.floor(payload / 2 ** bit) % 2);
    crc = ((crc << 1) & 31) ^ (feedback ? 5 : 0);
  }
  return crc ^ 31;
}

function integer(value: number, max: number): number {
  if (!Number.isInteger(value) || value < 0 || value > max) {
    throw new RangeError(`Expected integer 0..${max}`);
  }
  return value;
}

export function kortkodi(u: Uppskrift): string {
  let payload = 0;
  for (const { id } of LITEFNI) payload = payload * 64 + integer(u.dropar[id] ?? 0, HAMARK_DROPA);
  payload = ((payload * 64 + integer(u.vara, 63)) * 4 + integer(u.gljai, 3)) * 8 + integer(u.litrar, 5);
  let bits = payload * 32 + checksum(payload);
  let encoded = '';
  for (let i = 0; i < 12; i++) {
    encoded = ALPHABET[bits % 32] + encoded;
    bits = Math.floor(bits / 32);
  }
  return `MAL-${encoded.slice(0, 4)}-${encoded.slice(4, 8)}-${encoded.slice(8, 12)}`;
}

export function fraKodi(code: string): Uppskrift | null {
  const compact = code.replace(/[-\s]/g, '').toUpperCase();
  if (compact.length !== 15 || !compact.startsWith('MAL')) return null;
  const body = compact.slice(3).replace(/O/g, '0').replace(/[IL]/g, '1');
  let bits = 0;
  for (const letter of body) {
    const digit = ALPHABET.indexOf(letter);
    if (digit < 0) return null;
    bits = bits * 32 + digit;
    if (bits >= 2 ** 52) return null;
  }
  let payload = Math.floor(bits / 32);
  if (checksum(payload) !== bits % 32) return null;
  const litrar = payload % 8;
  if (litrar > 5) return null;
  payload = Math.floor(payload / 8);
  const gljai = payload % 4;
  payload = Math.floor(payload / 4);
  const vara = payload % 64;
  payload = Math.floor(payload / 64);
  const dropar: Dropar = {};
  for (let i = LITEFNI.length - 1; i >= 0; i--) {
    const drops = payload % 64;
    if (drops > HAMARK_DROPA) return null;
    dropar[LITEFNI[i].id] = drops;
    payload = Math.floor(payload / 64);
  }
  return { dropar, vara, gljai, litrar };
}
