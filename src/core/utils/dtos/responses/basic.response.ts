import { HttpStatus } from '@nestjs/common';

export interface BasicResponse {
  message: string;
  statusCode: HttpStatus;
}
