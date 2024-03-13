import Decimal from 'decimal.js';

export const toDecimal = (val?: string | number | null): Decimal | null => {
  try {
    return new Decimal(val);
  } catch {
    return null;
  }
};
