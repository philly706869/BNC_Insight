export type ValueObjectVerifyResult<Data> =
  | { valid: true; data: Data }
  | { valid: false; message: string };
