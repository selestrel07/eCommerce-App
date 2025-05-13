const status400 = 400;
const status401 = 401;
const status403 = 403;
const status404 = 404;
const status409 = 409;
const status500 = 500;

export enum HttpStatus {
  BAD_REQUEST = status400,
  UNAUTHORIZED = status401,
  FORBIDDEN = status403,
  NOT_FOUND = status404,
  CONFLICT = status409,
  INTERNAL_SERVER_ERROR = status500,
}
