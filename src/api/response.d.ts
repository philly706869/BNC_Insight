declare namespace Express {
  interface ErrorBody {
    error: string;
    message: string;
  }
  interface Response {
    error(body: ErrorBody);
  }
}
