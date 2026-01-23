/**
 * Number validation functions
 */

/**
 * Checks if a value is a valid number (not NaN or Infinity)
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);
}

/**
 * Checks if a number is an integer
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

/**
 * Checks if a number is positive (greater than 0)
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Checks if a number is negative (less than 0)
 */
export function isNegative(value: number): boolean {
  return value < 0;
}

/**
 * Checks if a number is zero
 */
export function isZero(value: number): boolean {
  return value === 0;
}

/**
 * Checks if a number is within a range (inclusive)
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Checks if a number is greater than a minimum value
 */
export function isGreaterThan(value: number, min: number): boolean {
  return value > min;
}

/**
 * Checks if a number is less than a maximum value
 */
export function isLessThan(value: number, max: number): boolean {
  return value < max;
}

/**
 * Checks if a number is greater than or equal to a minimum value
 */
export function isGreaterThanOrEqual(value: number, min: number): boolean {
  return value >= min;
}

/**
 * Checks if a number is less than or equal to a maximum value
 */
export function isLessThanOrEqual(value: number, max: number): boolean {
  return value <= max;
}

/**
 * Checks if a number is even
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * Checks if a number is odd
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * Checks if a number is divisible by another number
 */
export function isDivisibleBy(value: number, divisor: number): boolean {
  if (divisor === 0) return false;
  return value % divisor === 0;
}
