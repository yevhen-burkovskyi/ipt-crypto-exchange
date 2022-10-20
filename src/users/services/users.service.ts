import { ForbiddenException, Injectable } from '@nestjs/common';

import { UsersDao } from 'src/users/dao/users.dao';
import { BcryptService } from 'src/users/services/bcrypt.service';
import { TokenService } from 'src/users/services/token.service';
import { RegistrationDtoWithUserSalt } from 'src/users/dtos/types/registration-dto-with-user-salt.type';
import { RegistrationResponse } from 'src/users/dtos/responses/registration.response';
import { LoginDto } from 'src/users/dtos/dto/login.dto';
import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { RegistrationDtoWithRole } from 'src/users/dtos/types/registration-dto-with-role.type';
import { VerifyUserRoleDto } from 'src/users/dtos/dto/verify-user-role.dto';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { PersonalInformationDto } from 'src/users/dtos/dto/personal-information.dto';
import { UserResponse } from 'src/users/dtos/responses/user.response';

@Injectable()
export class UsersSerice {
  constructor(
    private readonly usersDao: UsersDao,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(
    payload: RegistrationDtoWithRole,
  ): Promise<RegistrationResponse> {
    const encryptResponse = await this.bcryptService.encrypt(payload.password);
    const registrationDtoWithUserSalt: RegistrationDtoWithUserSalt = {
      ...payload,
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

  async verifyUserRole(payload: VerifyUserRoleDto): Promise<boolean> {
    return this.usersDao.verifyUserRole(payload);
  }

  async getUserStatusById(userId: string): Promise<UserStatusesEnum> {
    return this.usersDao.getUserStatusById(userId);
  }

  async setUserPersonalInformation(
    payload: PersonalInformationDto,
    userId: string,
  ): Promise<void> {
    return this.usersDao.setUserPersonalInformation(payload, userId);
  }

  async getUserByUserId(userId: string): Promise<UserResponse> {
    const user = await this.usersDao.getUserByUserId(userId);
    return { user };
  }
}
