import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EnumsExceptionsResponse } from '@utils/enums.exceptions';

export interface IRpcException {
  message: string;
  status: number;
  details: string;
  code: number;
}

@Catch()
export class AllGlobalExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: IRpcException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = exception.code
      ? EnumsExceptionsResponse.statusCodeResponse[exception.code]
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: httpStatus,
      error: exception.code !== 6 ? exception.details : JSON.parse(exception.details),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
