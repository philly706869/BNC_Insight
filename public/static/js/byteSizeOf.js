const encoder = new TextEncoder();

export const byteSizeOf = (string) => encoder.encode(string).byteLength;
