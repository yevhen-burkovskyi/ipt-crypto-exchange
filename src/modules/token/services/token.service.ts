import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { TokenBodyDto } from 'src/modules/token/dtos/dto/token-body.dto';

@Injectable()
export class TokenService {
  private emailApproveSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.emailApproveSecret = this.configService.get('jwt.emailApproveSecret');
  }

  createToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  decryptToken(token: string): TokenBodyDto {
    try {
      const params = this.jwtService.verify(token);
      return { userId: params.userId };
    } catch (e) {
      throw new ForbiddenException(ErrorMessagesEnum.TOKEN);
    }
  }

  createEmailApproveToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      { secret: this.emailApproveSecret },
    );
  }

  decryptEmailApproveToken(token: string): TokenBodyDto {
    try {
      const params = this.jwtService.verify(token, {
        secret: this.emailApproveSecret,
      });
      return { userId: params.userId };
    } catch (e) {
      throw new ForbiddenException(ErrorMessagesEnum.TOKEN);
    }
  }
}
