import { HttpStatus } from '@nestjs/common';

import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';

export class ServerUtils {
  static createCommonResponse(
    message: string,
    statusCode: HttpStatus,
  ): BasicResponse {
    return { message, statusCode };
  }
}
