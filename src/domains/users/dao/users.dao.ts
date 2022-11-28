import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserEntity } from 'src/core/entities/user.entity';
import { RegistrationDtoWithUserSalt } from 'src/domains/users/dtos/types/registration-dto-with-user-salt.type';
import { LoginDto } from 'src/domains/users/dtos/dto/login.dto';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { VerifyUserRoleDto } from 'src/domains/users/dtos/dto/verify-user-role.dto';
import { PersonalInformationDto } from 'src/domains/users/dtos/dto/personal-information.dto';
import { Pagination } from 'src/core/types/pagination.type';
import { ApproveUsersIdentityDto } from 'src/domains/users/dtos/dto/approve-users-identity.dto';

@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async registration(
    payload: RegistrationDtoWithUserSalt,
  ): Promise<UserEntity> {
    return this.usersRepository.save(payload);
  }

  async countEmails(email: string): Promise<number> {
    return this.usersRepository.count({ where: { email } });
  }

  async getUserSaltByEmail(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['userSalt'],
    });
    return user.userSalt;
  }

  async login(payload: LoginDto): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: payload });
  }

  async verifyUserRole(payload: VerifyUserRoleDto): Promise<boolean> {
    const count = await this.usersRepository.count({
      where: {
        id: payload.userId,
        role: {
          name: In(payload.roleName),
        },
      },
    });
    return count >= 1;
  }

  async getUserStatusById(userId: string): Promise<UserStatusesEnum> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['status'],
    });
    return user.status;
  }

  async setUserPersonalInformation(
    payload: PersonalInformationDto,
    userId: string,
  ): Promise<void> {
    const newUserStatus = UserStatusesEnum.EMAIL_VERIFICATION;
    await this.usersRepository.update(
      { id: userId },
      { profile: payload, status: newUserStatus },
    );
  }

  async getUserByUserId(userId: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async getUserEmailByUserId(userId: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['email'],
    });
    return user.email;
  }

  async activateUserEmail(userId: string): Promise<void> {
    const newUserStatus = UserStatusesEnum.PERSONALITY_VERIFICATION;
    await this.usersRepository.update(
      { id: userId },
      { status: newUserStatus },
    );
  }

  async getWaitingUsersForApprove(payload: Pagination): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: { status: UserStatusesEnum.PERSONALITY_VERIFICATION },
      take: payload.limit,
      skip: payload.offset,
    });
  }

  async approveUsersById(payload: ApproveUsersIdentityDto): Promise<void> {
    await this.usersRepository.update(payload.userIds, {
      status: UserStatusesEnum.ACTIVE,
    });
  }

  async getUserEmailsByIds(
    payload: ApproveUsersIdentityDto,
  ): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: { id: In(payload.userIds) },
      select: ['email'],
    });
  }
}
