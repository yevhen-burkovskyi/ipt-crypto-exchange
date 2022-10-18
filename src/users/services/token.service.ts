import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { TokenBodyDto } from 'src/users/services/dto/token-body.dto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  decryptToken(token: string): TokenBodyDto {
    try {
      const params = this.jwtService.verify(token);
      return { userId: params.userId };
    } catch (e) {
      throw new Error(ErrorMessagesEnum.TOKEN);
    }
  }
}
