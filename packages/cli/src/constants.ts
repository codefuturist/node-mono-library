/**
 * CLI Constants
 */

export const VERSION = "0.1.0";
export const CLI_NAME = "repo-cli";
export const CLI_DESCRIPTION =
  "A powerful CLI tool demonstrating @repo/utils and @repo/validators";

export const SCHEMAS = {
  user: {
    email: "email",
    age: "number:13:120",
    name: "string:2:50",
  },
  product: {
    name: "string:1:100",
    price: "number:0:1000000",
    sku: "alphanumeric",
    url: "url",
  },
  contact: {
    email: "email",
    phone: "phone",
    website: "url",
  },
} as const;

export type SchemaName = keyof typeof SCHEMAS;
