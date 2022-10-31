import { HttpStatus } from "@nestjs/common";

export interface CommonResponseDto {
    message: string;
    statusCode: HttpStatus;
}