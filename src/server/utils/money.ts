import { ServerError } from '@utils/errors';
import { GenericErrors } from '@typings/Errors';

/** Reject non-finite, non-positive, or fractional money amounts. */
export const assertPositiveMoney = (amount: unknown): number => {
  const value = typeof amount === 'number' ? amount : Number(amount);

  if (!Number.isFinite(value) || !Number.isInteger(value) || value <= 0) {
    throw new ServerError(GenericErrors.BadInput);
  }

  return value;
};

export const assertNonNegativeMoney = (amount: unknown): number => {
  const value = typeof amount === 'number' ? amount : Number(amount);

  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new ServerError(GenericErrors.BadInput);
  }

  return value;
};
