import { HttpStatus, Injectable } from '@nestjs/common';

import { UsersSerice } from 'src/domains/users/services/users.service';
import { RegistrationDto } from 'src/domains/users/dtos/dto/registration.dto';
import { RegistrationResponse } from 'src/domains/users/dtos/responses/registration.response';
import { LoginDto } from 'src/domains/users/dtos/dto/login.dto';
import { RolesManager } from 'src/modules/roles/managers/roles.manager';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { VerifyUserRoleDto } from 'src/domains/users/dtos/dto/verify-user-role.dto';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { PersonalInformationDto } from 'src/domains/users/dtos/dto/personal-information.dto';
import { UserResponse } from 'src/domains/users/dtos/responses/user.response';
import { SmtpManager } from 'src/modules/smtp/managers/smtp.manager';
import { CacheManager } from 'src/modules/cache/managers/cache.manager';
import { ServerUtils } from 'src/core/utils/server.utils';
import { UserResponsesEnum } from 'src/core/enums/user-responses.enum';
import { ApproveEmailDto } from 'src/domains/users/dtos/dto/approve-email.dto';
import { BcryptManager } from 'src/modules/bcrypt/managers/bcrypt.manager';
import { RegistrationDtoWithUserSalt } from 'src/domains/users/dtos/types/registration-dto-with-user-salt.type';
import { TokenManager } from 'src/modules/token/managers/token.managers';
import { SendEmailConfirmationDto } from 'src/modules/smtp/dtos/dto/send-email-confirmation.dto';
import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';

@Injectable()
export class UsersManager {
  constructor(
    private readonly usersService: UsersSerice,
    private readonly rolesManager: RolesManager,
    private readonly smtpManager: SmtpManager,
    private readonly cacheManager: CacheManager,
    private readonly bcryptManager: BcryptManager,
    private readonly tokenManager: TokenManager,
  ) {}

  async registration(payload: RegistrationDto): Promise<RegistrationResponse> {
    const encryptResponse = await this.bcryptManager.encrypt(payload.password);
    const registrationDto: RegistrationDtoWithUserSalt = {
      ...payload,
      password: encryptResponse.encryptedPassword,
      userSalt: encryptResponse.salt,
      role: await this.rolesManager.getRoleByName(RolesEnum.USER),
    };
    const user = await this.usersService.registration(registrationDto);
    const token = this.tokenManager.createToken(user.id);

    return { user, token };
  }

  async login(payload: LoginDto): Promise<RegistrationResponse> {
    const userSalt = await this.usersService.getUserSaltByEmail(payload.email);
    const encryptedPassword = await this.bcryptManager.encryptBySalt(
      payload.password,
      userSalt,
    );

    payload.password = encryptedPassword;

    const user = await this.usersService.login(payload);
    const token = this.tokenManager.createToken(user.id);

    return { user, token };
  }

  async verifyUserRole(payload: VerifyUserRoleDto): Promise<boolean> {
    return this.usersService.verifyUserRole(payload);
  }

  async getUserStatusById(userId: string): Promise<UserStatusesEnum> {
    return this.usersService.getUserStatusById(userId);
  }

  async setUserPersonalInformation(
    payload: PersonalInformationDto,
    userId: string,
  ): Promise<void> {
    return this.usersService.setUserPersonalInformation(payload, userId);
  }

  async getUserByUserId(userId: string): Promise<UserResponse> {
    const user = await this.usersService.getUserByUserId(userId);
    return { user };
  }

  async sendEmailApprove(userId: string): Promise<BasicResponse> {
    const userEmail = await this.usersService.getUserEmailByUserId(userId);
    const token = this.tokenManager.createEmailApproveToken(userId);
    const sendEmailConfirmationDto: SendEmailConfirmationDto = {
      userEmail,
      token,
    };

    this.smtpManager.sendEmailConfirmation(sendEmailConfirmationDto);
    await this.cacheManager.saveEmailTimeout(userId);
    return ServerUtils.createCommonResponse(
      UserResponsesEnum.EMAIL,
      HttpStatus.OK,
    );
  }

  async activateUserEmail(payload: ApproveEmailDto): Promise<UserResponse> {
    const userData = this.tokenManager.decryptEmailApproveToken(
      payload.approveToken,
    );

    await this.usersService.activateUserEmail(userData.userId);

    const user = await this.usersService.getUserByUserId(userData.userId);

    return { user };
  }

  async isEmailExists(email: string): Promise<boolean> {
    return this.usersService.isEmailExists(email);
  }
}
