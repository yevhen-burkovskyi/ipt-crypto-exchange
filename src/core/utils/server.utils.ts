import { HttpStatus } from "@nestjs/common";
import { CommonResponseDto } from "src/core/dto/common-response.dto";

export class ServerUtils {
    static createCommonResponse(message: string, statusCode: HttpStatus): CommonResponseDto {
        return { message, statusCode };
    }
}