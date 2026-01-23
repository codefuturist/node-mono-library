/**
 * Object validation functions
 */

/**
 * Checks if a value is a plain object (not array, null, or other types)
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Checks if a value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if a value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Checks if a value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Checks if a value is not null or undefined
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Checks if an object has all specified keys
 */
export function hasKeys<T extends object>(obj: T, keys: (keyof T)[]): boolean {
  return keys.every((key) => key in obj);
}

/**
 * Checks if an object has at least one of the specified keys
 */
export function hasAnyKey<T extends object>(
  obj: T,
  keys: (keyof T)[]
): boolean {
  return keys.some((key) => key in obj);
}

/**
 * Checks if an object is empty (has no own properties)
 */
export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Checks if an array is empty
 */
export function isEmptyArray(arr: unknown[]): boolean {
  return arr.length === 0;
}

/**
 * Checks if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if an array has a minimum length
 */
export function hasMinItems<T>(arr: T[], minLength: number): boolean {
  return arr.length >= minLength;
}

/**
 * Checks if an array has a maximum length
 */
export function hasMaxItems<T>(arr: T[], maxLength: number): boolean {
  return arr.length <= maxLength;
}

/**
 * Checks if an array contains a specific value
 */
export function includes<T>(arr: T[], value: T): boolean {
  return arr.includes(value);
}
