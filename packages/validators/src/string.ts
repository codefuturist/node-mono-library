/**
 * String validation functions
 */

/**
 * Checks if a string is empty or contains only whitespace
 */
export function isEmpty(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * Checks if a string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Checks if a string meets minimum length requirement
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Checks if a string meets maximum length requirement
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Checks if a string length is within a range
 */
export function hasLengthBetween(
  value: string,
  min: number,
  max: number
): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Checks if a string contains only alphabetic characters
 */
export function isAlpha(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value);
}

/**
 * Checks if a string contains only alphanumeric characters
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Checks if a string matches a regular expression pattern
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Checks if a string contains a substring
 */
export function contains(value: string, substring: string): boolean {
  return value.includes(substring);
}

/**
 * Checks if a string starts with a prefix
 */
export function startsWith(value: string, prefix: string): boolean {
  return value.startsWith(prefix);
}

/**
 * Checks if a string ends with a suffix
 */
export function endsWith(value: string, suffix: string): boolean {
  return value.endsWith(suffix);
}
