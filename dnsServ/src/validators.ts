export const NS_NAME_REGEX = /^([a-z0-9]|[a-z0-9][a-z0-9\-]{0,61}[a-z0-9])(\.([a-z0-9]|[a-z0-9][a-z0-9\-]{0,61}[a-z0-9]))*$/i;

export function validateNsName(value: string) {
  if (typeof value !== "string") return false;
  if (value.length > 255) return false;
  return NS_NAME_REGEX.test(value);
}

export function validateUint32BE(value: number | string) {
  if (typeof value === "string") value = parseInt(value);
  if (typeof value !== "number") return false;
  return !isNaN(value) && value < 4294967295;
}

export function validateUint16BE(value: number | string) {
  if (typeof value === "string") value = parseInt(value);
  if (typeof value !== "number") return false;
  return !isNaN(value) && value < 65535;
}

export function validateNsText(value: string) {
  if (typeof value !== "string") return false;
  return value.length < 256;
}
