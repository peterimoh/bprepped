import { HttpStatusCodes } from '../common/constants';

type StatusCodes = keyof typeof HttpStatusCodes;

export class CustomError extends Error {
  type: string;
  statusCode: number;

  constructor(type: string, statusCode: StatusCodes, message: string) {
    super(message);
    this.type = type;
    this.name = type;
    this.statusCode = HttpStatusCodes[statusCode];
    Object.setPrototypeOf(this, new.target.prototype); // Support instanceof with subclasses
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string) {
    super('InternalServerError', 'INTERNAL_SERVER_ERROR', message);
  }
}

export class DateRangeError extends CustomError {
  constructor(message: string) {
    super('DateRangeError', 'BAD_REQUEST', message);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super('ValidationError', 'BAD_REQUEST', message);
  }
}
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super('NotFoundError', 'NOT_FOUND', message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Access Denied') {
    super('ForbiddenError', 'FORBIDDEN', message);
  }
}

export class UnAuthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super('UnAuthorizedError', 'UNAUTHORIZED', message);
  }
}
