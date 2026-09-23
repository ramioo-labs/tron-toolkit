/** TRX has 6 decimal places (1 TRX = 1_000_000 SUN). */
export const SUN_PER_TRX = 1_000_000n;

export class AmountError extends Error {
    constructor(message: string) {
          super(message);
          this.name = 'AmountError';
    }
}

function assertNonNegativeIntegerString(value: string, label: string): bigint {
    if (!/^\d+$/.test(value)) {
          throw new AmountError(`${label} must be a non-negative integer string`);
    }
    return BigInt(value);
}

/** Convert TRX (integer or decimal string up to 6 places) to SUN. */
export function trxToSun(trx: string): bigint {
    const trimmed = trx.trim();
    if (!/^\d+(\.\d{1,6})?$/.test(trimmed)) {
          throw new AmountError('trx must be a non-negative decimal with at most 6 places');
    }
    const [whole, frac = ''] = trimmed.split('.');
    const fracPadded = (frac + '000000').slice(0, 6);
    return BigInt(whole) * SUN_PER_TRX + BigInt(fracPadded);
}

/** Convert SUN integer string to TRX decimal string (no float). */
export function sunToTrx(sun: string): string {
    const n = assertNonNegativeIntegerString(sun, 'sun');
    const whole = n / SUN_PER_TRX;
    const frac = n % SUN_PER_TRX;
    if (frac === 0n) return whole.toString();
    const fracStr = frac.toString().padStart(6, '0').replace(/0+$/, '');
    return `${whole}.${fracStr}`;
}

/** Scale raw token amount by decimals (e.g. USDT 6). */
export function scaleTokenAmount(raw: string, decimals: number): bigint {
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
          throw new AmountError('decimals must be an integer 0..36');
    }
    const n = assertNonNegativeIntegerString(raw, 'raw');
    return n * 10n ** BigInt(decimals);
}

export function unscaleTokenAmount(scaled: string, decimals: number): string {
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
          throw new AmountError('decimals must be an integer 0..36');
    }
    const n = assertNonNegativeIntegerString(scaled, 'scaled');
    if (decimals === 0) return n.toString();
    const base = 10n ** BigInt(decimals);
    const whole = n / base;
    const frac = n % base;
    if (frac === 0n) return whole.toString();
    const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '');
    return `${whole}.${fracStr}`;
}
