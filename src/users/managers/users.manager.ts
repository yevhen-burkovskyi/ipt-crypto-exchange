import { Injectable } from '@nestjs/common';

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

@Injectable()
export class UsersManager {
  constructor(
    private readonly usersService: UsersSerice,
    private readonly rolesManager: RolesManager,
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
}
