declare namespace Express {
  interface ErrorBody {
    errors: (
      | {
          error: string;
          message: string;
        }
      | {
          error: string;
          messages: string[];
        }
    )[];
  }
  interface Response {
    error(body: ErrorBody);
  }
}
