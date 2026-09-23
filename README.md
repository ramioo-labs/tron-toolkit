# tron-toolkit

Small TRON helpers with bigint-safe amount conversion (no float money math).

## Amount helpers

```ts
import { trxToSun, sunToTrx, scaleTokenAmount } from './src/amount';

trxToSun('1.5'); // 1500000n SUN
sunToTrx('1500000'); // '1.5'
scaleTokenAmount('1', 6); // 1000000n for 6-decimal tokens
```

Tests use no live network. Closes #1 when amount helpers land.
