import { StatusCodes } from "http-status-codes";
import { ResponsibleError } from "./responsible-error";

export class RouterError extends ResponsibleError {
  public constructor(statusCode: number, errorCode: string, message: string) {
    super(statusCode, errorCode, message);
  }
}

export class APINotFoundError extends RouterError {
  public constructor(message: string = "") {
    super(StatusCodes.NOT_FOUND, "API_NOT_FOUND", message);
  }
}
