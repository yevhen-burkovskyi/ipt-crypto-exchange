import { HttpStatus } from '@nestjs/common';
import { generate } from 'generate-password';

import { PasswordParams } from 'src/core/consts/managers.consts';
import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';

export class ServerUtils {
  static createCommonResponse(
    message: string,
    statusCode: HttpStatus,
  ): BasicResponse {
    return { message, statusCode };
  }

  static generateManagerPassword(): string {
    return generate(PasswordParams);
  }

  static take18YearsInMs(): number {
    return 1000 * 60 * 60 * 24 * 365 * 18;
  }
}
