# @repo/validators

Shared validation functions for the monorepo. This package provides type-safe validators for strings, numbers, objects, dates, and common formats.

## Installation

### From npm (after publishing)

```bash
# npm
npm install @repo/validators

# pnpm
pnpm add @repo/validators

# yarn
yarn add @repo/validators
```

### Within the monorepo

If you're using this package within the monorepo, add it to your app's `package.json`:

```json
{
  "dependencies": {
    "@repo/validators": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

## Usage

### String Validators

```typescript
import { isEmpty, hasMinLength, isAlphanumeric } from "@repo/validators/string";

isEmpty(""); // true
isEmpty("   "); // true (whitespace only)
hasMinLength("hello", 3); // true
isAlphanumeric("abc123"); // true
```

### Number Validators

```typescript
import {
  isNumber,
  isInteger,
  isInRange,
  isPositive,
} from "@repo/validators/number";

isNumber(42); // true
isNumber(NaN); // false
isInteger(3.14); // false
isInRange(5, 1, 10); // true
isPositive(-5); // false
```

### Object Validators

```typescript
import {
  isPlainObject,
  isNullish,
  hasKeys,
  isArray,
} from "@repo/validators/object";

isPlainObject({}); // true
isPlainObject([]); // false
isNullish(null); // true
hasKeys({ a: 1 }, ["a"]); // true
isArray([1, 2, 3]); // true
```

### Date Validators

```typescript
import {
  isValidDate,
  isPast,
  isFuture,
  isWeekend,
} from "@repo/validators/date";

isValidDate(new Date()); // true
isValidDate(new Date("invalid")); // false
isPast(new Date("2020-01-01")); // true
isFuture(new Date("2030-01-01")); // true
isWeekend(new Date("2024-01-13")); // true (Saturday)
```

### Format Validators

```typescript
import { isEmail, isUrl, isUuid, isPhoneNumber } from "@repo/validators/format";

isEmail("user@example.com"); // true
isUrl("https://example.com"); // true
isUuid("550e8400-e29b-41d4-a716-446655440000"); // true
isPhoneNumber("+1-555-123-4567"); // true
isCreditCard("4111111111111111"); // true (Luhn check)
isHexColor("#ff5733"); // true
```

## Development

```bash
pnpm build          # Build the package
pnpm dev            # Watch mode
pnpm test           # Run tests
pnpm test:coverage  # Run tests with coverage
pnpm check-types    # Type check
pnpm lint           # Lint
```

## API Reference

### String Validators

| Function                          | Description                             |
| --------------------------------- | --------------------------------------- |
| `isEmpty(str)`                    | Checks if string is empty or whitespace |
| `isNotEmpty(str)`                 | Checks if string has content            |
| `hasMinLength(str, min)`          | Validates minimum length                |
| `hasMaxLength(str, max)`          | Validates maximum length                |
| `hasLengthBetween(str, min, max)` | Validates length range                  |
| `isAlpha(str)`                    | Checks for alphabetic only              |
| `isAlphanumeric(str)`             | Checks for alphanumeric only            |
| `matchesPattern(str, regex)`      | Tests against regex                     |
| `contains(str, substring)`        | Checks for substring                    |
| `startsWith(str, prefix)`         | Checks prefix                           |
| `endsWith(str, suffix)`           | Checks suffix                           |

### Number Validators

| Function                      | Description                  |
| ----------------------------- | ---------------------------- |
| `isNumber(value)`             | Type guard for valid numbers |
| `isInteger(num)`              | Checks for integer           |
| `isPositive(num)`             | Checks if > 0                |
| `isNegative(num)`             | Checks if < 0                |
| `isZero(num)`                 | Checks if === 0              |
| `isInRange(num, min, max)`    | Validates range (inclusive)  |
| `isGreaterThan(num, min)`     | Checks if > min              |
| `isLessThan(num, max)`        | Checks if < max              |
| `isEven(num)`                 | Checks for even              |
| `isOdd(num)`                  | Checks for odd               |
| `isDivisibleBy(num, divisor)` | Checks divisibility          |

### Object Validators

| Function                | Description                   |
| ----------------------- | ----------------------------- |
| `isPlainObject(value)`  | Type guard for plain objects  |
| `isNull(value)`         | Type guard for null           |
| `isUndefined(value)`    | Type guard for undefined      |
| `isNullish(value)`      | Type guard for null/undefined |
| `isNotNullish(value)`   | Inverse of isNullish          |
| `hasKeys(obj, keys)`    | Checks all keys exist         |
| `hasAnyKey(obj, keys)`  | Checks any key exists         |
| `isEmptyObject(obj)`    | Checks for empty object       |
| `isEmptyArray(arr)`     | Checks for empty array        |
| `isArray(value)`        | Type guard for arrays         |
| `hasMinItems(arr, min)` | Validates minimum items       |
| `hasMaxItems(arr, max)` | Validates maximum items       |
| `includes(arr, value)`  | Checks array contains value   |

### Date Validators

| Function                           | Description               |
| ---------------------------------- | ------------------------- |
| `isValidDate(value)`               | Type guard for valid Date |
| `isValidDateString(str)`           | Validates date string     |
| `isPast(date)`                     | Checks if in past         |
| `isFuture(date)`                   | Checks if in future       |
| `isToday(date)`                    | Checks if today           |
| `isBefore(date, compareTo)`        | Checks if before          |
| `isAfter(date, compareTo)`         | Checks if after           |
| `isBetweenDates(date, start, end)` | Validates date range      |
| `isWeekend(date)`                  | Checks for Sat/Sun        |
| `isWeekday(date)`                  | Checks for Mon-Fri        |
| `isSameDay(date1, date2)`          | Compares days             |
| `isLeapYear(year)`                 | Validates leap year       |

### Format Validators

| Function             | Description                  |
| -------------------- | ---------------------------- |
| `isEmail(str)`       | Validates email format       |
| `isUrl(str)`         | Validates HTTP(S) URL        |
| `isUuid(str)`        | Validates UUID v4            |
| `isPhoneNumber(str)` | Validates phone format       |
| `isCreditCard(str)`  | Validates via Luhn algorithm |
| `isHexColor(str)`    | Validates hex color          |
| `isIpv4(str)`        | Validates IPv4 address       |
| `isSlug(str)`        | Validates URL slug           |
| `isJson(str)`        | Validates JSON string        |
| `isBase64(str)`      | Validates base64 encoding    |
| `isSemver(str)`      | Validates semantic version   |

---
