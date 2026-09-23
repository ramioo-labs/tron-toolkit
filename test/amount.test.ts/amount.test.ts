import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AmountError, scaleTokenAmount, sunToTrx, trxToSun, unscaleTokenAmount } from '../src/amount';

describe('trxToSun / sunToTrx', () => {
  it('converts whole TRX', () => {
    assert.equal(trxToSun('1'), 1_000_000n);
    assert.equal(sunToTrx('1000000'), '1');
  });
  it('handles decimal TRX without float', () => {
    assert.equal(trxToSun('1.5'), 1_500_000n);
    assert.equal(sunToTrx('1500000'), '1.5');
  });
  it('handles zero and large values', () => {
    assert.equal(trxToSun('0'), 0n);
    assert.equal(trxToSun('1000000000'), 1_000_000_000_000_000n);
  });
  it('rejects invalid input', () => {
    assert.throws(() => trxToSun('-1'), AmountError);
    assert.throws(() => trxToSun('1.1234567'), AmountError);
    assert.throws(() => sunToTrx('1.2'), AmountError);
  });
});

describe('token scale', () => {
  it('scales and unscales USDT-like 6 decimals', () => {
    assert.equal(scaleTokenAmount('1', 6), 1_000_000n);
    assert.equal(unscaleTokenAmount('1500000', 6), '1.5');
  });
});
