import { HttpStatus, Injectable } from '@nestjs/common';

import { UsersSerice } from 'src/users/services/users.service';
import { RegistrationDto } from 'src/users/dtos/dto/registration.dto';
import { RegistrationResponse } from 'src/users/dtos/responses/registration.response';
import { LoginDto } from 'src/users/dtos/dto/login.dto';
import { RolesManager } from 'src/roles/managers/roles.manager';
import { RegistrationDtoWithRole } from 'src/users/dtos/types/registration-dto-with-role.type';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { VerifyUserRoleDto } from 'src/users/dtos/dto/verify-user-role.dto';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { PersonalInformationDto } from 'src/users/dtos/dto/personal-information.dto';
import { UserResponse } from 'src/users/dtos/responses/user.response';
import { SmtpManager } from 'src/smtp/managers/smtp.manager';
import { CacheManager } from 'src/cache/managers/cache.manager';
import { ServerUtils } from 'src/core/utils/server.utils';
import { UserResponsesEnum } from 'src/core/enums/user-responses.enum';
import { CommonResponseDto } from 'src/core/dto/common-response.dto';
import { ApproveEmailDto } from 'src/users/dtos/dto/approve-email.dto';

@Injectable()
export class UsersManager {
  constructor(
    private readonly usersService: UsersSerice,
    private readonly rolesManager: RolesManager,
    private readonly smtpManager: SmtpManager,
    private readonly cacheManager: CacheManager,
  ) {}

  async registration(payload: RegistrationDto): Promise<RegistrationResponse> {
    const registrationDtoWithRole: RegistrationDtoWithRole = {
      ...payload,
      role: await this.rolesManager.getRoleByName(RolesEnum.USER),
    };
    return this.usersService.registration(registrationDtoWithRole);
  }

  async login(payload: LoginDto): Promise<RegistrationResponse> {
    return this.usersService.login(payload);
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
    return this.usersService.getUserByUserId(userId);
  }

  async sendEmailApprove(userId: string): Promise<CommonResponseDto> {
    const sendEmailConfirmationDto =
      await this.usersService.createSendEmailConfirmationPayload(userId);
    this.smtpManager.sendEmailConfirmation(sendEmailConfirmationDto);
    await this.cacheManager.saveEmailTimeout(userId);
    return ServerUtils.createCommonResponse(UserResponsesEnum.EMAIL, HttpStatus.OK);
  }

  async activateUserEmail(payload: ApproveEmailDto): Promise<UserResponse> {
    const userData = await this.usersService.getUserDataFromApproveToken(payload.approveToken);
    await this.usersService.activateUserEmail(userData.userId);
    return this.usersService.getUserByUserId(userData.userId);
  }
}
