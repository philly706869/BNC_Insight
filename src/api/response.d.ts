declare namespace Express {
  export interface Response {
    error({ error: string, message: string });
  }
}
