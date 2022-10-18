import { ForbiddenException, Injectable } from '@nestjs/common';

import { RegistrationDto } from 'src/users/controllers/dto/registration.dto';
import { UsersDao } from 'src/users/dao/users.dao';
import { BcryptService } from 'src/users/services/bcrypt.service';
import { TokenService } from 'src/users/services/token.service';
import { RegistrationDtoWithUserSalt } from 'src/users/services/types/registration-dto-with-user-salt.type';
import { RegistrationResponse } from 'src/users/services/responses/registration.response';
import { LoginDto } from 'src/users/controllers/dto/login.dto';
import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';

@Injectable()
export class UsersSerice {
  constructor(
    private readonly usersDao: UsersDao,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(payload: RegistrationDto): Promise<RegistrationResponse> {
    const encryptResponse = await this.bcryptService.encrypt(payload.password);
    const registrationDtoWithUserSalt: RegistrationDtoWithUserSalt = {
      email: payload.email,
      password: encryptResponse.encryptedPassword,
      userSalt: encryptResponse.salt,
    };
    const user = await this.usersDao.registration(registrationDtoWithUserSalt);
    const token = this.tokenService.createToken(user.id);
    return { user, token };
  }

  async login(payload: LoginDto): Promise<RegistrationResponse> {
    const userSalt = await this.usersDao.getUserSaltByEmail(payload.email);
    const encryptedPassword = await this.bcryptService.encryptBySalt(
      payload.password,
      userSalt,
    );

    payload.password = encryptedPassword;

    const user = await this.usersDao.login(payload);

    if (!user) {
      throw new ForbiddenException(ErrorMessagesEnum.LOGIN);
    }

    const token = this.tokenService.createToken(user.id);
    return { user, token };
  }
}
