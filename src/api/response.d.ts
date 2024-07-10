declare namespace Express {
  interface ErrorBody {
    errors: {
      error: string;
      message: string;
    }[];
  }
  interface Response {
    error(body: ErrorBody);
  }
}
