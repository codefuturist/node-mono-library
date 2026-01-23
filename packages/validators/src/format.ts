/**
 * Format validation functions (email, URL, phone, etc.)
 */

/**
 * Checks if a string is a valid email address
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Checks if a string is a valid URL
 */
export function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Checks if a string is a valid UUID (v4)
 */
export function isUuid(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Checks if a string is a valid phone number (basic international format)
 */
export function isPhoneNumber(value: string): boolean {
  // Supports formats: +1234567890, 123-456-7890, (123) 456-7890, etc.
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 7;
}

/**
 * Checks if a string is a valid credit card number (Luhn algorithm)
 */
export function isCreditCard(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]!, 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Checks if a string is a valid hex color
 */
export function isHexColor(value: string): boolean {
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  return hexRegex.test(value);
}

/**
 * Checks if a string is a valid IPv4 address
 */
export function isIpv4(value: string): boolean {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(value);
}

/**
 * Checks if a string is a valid slug (URL-friendly string)
 */
export function isSlug(value: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(value);
}

/**
 * Checks if a string is a valid JSON
 */
export function isJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a string is a valid base64 encoded string
 */
export function isBase64(value: string): boolean {
  if (value.length === 0) return false;
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(value) && value.length % 4 === 0;
}

/**
 * Checks if a string is a valid semantic version (semver)
 */
export function isSemver(value: string): boolean {
  const semverRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  return semverRegex.test(value);
}
