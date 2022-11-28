import { ForbiddenException, Injectable } from '@nestjs/common';

import { UsersDao } from 'src/domains/users/dao/users.dao';
import { RegistrationDtoWithUserSalt } from 'src/domains/users/dtos/types/registration-dto-with-user-salt.type';
import { LoginDto } from 'src/domains/users/dtos/dto/login.dto';
import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { VerifyUserRoleDto } from 'src/domains/users/dtos/dto/verify-user-role.dto';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { PersonalInformationDto } from 'src/domains/users/dtos/dto/personal-information.dto';
import { UserEntity } from 'src/core/entities/user.entity';
import { Pagination } from 'src/core/types/pagination.type';
import { ApproveUsersIdentityDto } from 'src/domains/users/dtos/dto/approve-users-identity.dto';

@Injectable()
export class UsersSerice {
  constructor(private readonly usersDao: UsersDao) {}

  async registration(
    payload: RegistrationDtoWithUserSalt,
  ): Promise<UserEntity> {
    return this.usersDao.registration(payload);
  }

  async login(payload: LoginDto): Promise<UserEntity> {
    const user = await this.usersDao.login(payload);

    if (!user) {
      throw new ForbiddenException(ErrorMessagesEnum.LOGIN);
    }

    return user;
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

  async getUserByUserId(userId: string): Promise<UserEntity> {
    return this.usersDao.getUserByUserId(userId);
  }

  async getUserEmailByUserId(userId: string): Promise<string> {
    return this.usersDao.getUserEmailByUserId(userId);
  }

  async activateUserEmail(userId: string): Promise<void> {
    return this.usersDao.activateUserEmail(userId);
  }

  async getUserSaltByEmail(userId: string): Promise<string> {
    return this.usersDao.getUserSaltByEmail(userId);
  }

  async isEmailExists(email: string): Promise<boolean> {
    const emailsCount = await this.usersDao.countEmails(email);
    return emailsCount >= 1;
  }

  async getWaitingUsersForApprove(payload: Pagination): Promise<UserEntity[]> {
    return this.usersDao.getWaitingUsersForApprove(payload);
  }

  async approveUsersById(payload: ApproveUsersIdentityDto): Promise<void> {
    return this.usersDao.approveUsersById(payload);
  }

  async getUserEmailsByIds(
    payload: ApproveUsersIdentityDto,
  ): Promise<string[]> {
    const users = await this.usersDao.getUserEmailsByIds(payload);
    return users.map((objWithEmail: { email: string }) => {
      return objWithEmail.email;
    });
  }
}
