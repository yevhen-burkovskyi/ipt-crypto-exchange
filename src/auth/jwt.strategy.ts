import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RequestWithUserContextType } from 'src/core/types/request-with-user-context.type';
import { JwtValidationResultDto } from 'src/auth/dto/jwt-validation-result.dto';
import { TokenBodyDto } from 'src/users/services/dto/token-body.dto';
import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { UsersManager } from 'src/users/managers/users.manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersManager: UsersManager,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithUserContextType,
    decodedJwt: TokenBodyDto,
  ): Promise<JwtValidationResultDto> {
    const jwtValidationResult: JwtValidationResultDto = {
      isValid: false,
    };
    try {
      const userId = decodedJwt.userId;
      if (userId) {
        const userStatus = await this.usersManager.getUserStatusById(userId);
        req.userContext = { userId, userStatus };
        jwtValidationResult.isValid = true;
      }
    } catch (e) {
      throw new Error(ErrorMessagesEnum.TOKEN);
    }
    return jwtValidationResult;
  }
}
