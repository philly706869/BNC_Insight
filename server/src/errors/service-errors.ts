export class InvalidAuthTokenError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}

export class IncorrectPasswordError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}

export class UserNotFoundError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}

export class CategoryNotFoundError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}

export class ArticleNotFoundError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}

export class ImageNotFoundError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}

export class QueryLimitOutOfBoundsError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}

export class QueryOffsetOutOfBoundsError extends Error {
  public constructor(message?: string) {
    super(message);
  }
}
