const encoder = new TextEncoder();

export function byteSizeOf(string) {
  return encoder.encode(string).byteLength;
}
