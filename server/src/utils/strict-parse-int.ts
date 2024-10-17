const intRegex = /^[-+]?\d+$/;

export function strictParseInt(value: string): number {
  return intRegex.test(value) ? Number(value) : NaN;
}
