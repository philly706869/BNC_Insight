declare namespace Express {
  export interface Response {
    error<Body extends { error: string; message: string }>(
      body: Body
    ): ReturnType<Response["json"]>;
  }
}
