import { Injectable } from '@nestjs/common';

import { TokenBodyDto } from 'src/modules/token/dtos/dto/token-body.dto';
import { TokenService } from 'src/modules/token/services/token.service';

@Injectable()
export class TokenManager {
  constructor(private readonly tokenService: TokenService) {}

  createToken(userId: string): string {
    return this.tokenService.createToken(userId);
  }

  decryptToken(token: string): TokenBodyDto {
    return this.tokenService.decryptToken(token);
  }

  createEmailApproveToken(userId: string): string {
    return this.tokenService.createEmailApproveToken(userId);
  }

  decryptEmailApproveToken(token: string): TokenBodyDto {
    return this.tokenService.decryptEmailApproveToken(token);
  }
}
