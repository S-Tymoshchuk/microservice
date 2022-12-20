import { HttpStatus } from '@nestjs/common';
import { status } from '@grpc/grpc-js';

export class EnumsExceptionsResponse {
  static statusCodeResponse: Record<number, number> = {
    [status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [status.ABORTED]: HttpStatus.GONE,
    [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [status.CANCELLED]: 499,
    [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
    [status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [status.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,

    [status.UNAVAILABLE]: HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
    [status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
    [status.CANCELLED]: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    [status.CANCELLED]: HttpStatus.UNPROCESSABLE_ENTITY,
    [status.UNKNOWN]: HttpStatus.I_AM_A_TEAPOT,
    [status.CANCELLED]: HttpStatus.METHOD_NOT_ALLOWED,
    [status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
  };
}
