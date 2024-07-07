declare module express {
  interface Response {
    error({
      error: string,
      message: string,
    }): Response<any, Record<string, any>, number>;
  }
}
