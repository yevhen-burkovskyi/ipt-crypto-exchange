import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserEntity } from 'src/core/entities/user.entity';
import { RegistrationDtoWithUserSalt } from 'src/users/dtos/types/registration-dto-with-user-salt.type';
import { LoginDto } from 'src/users/dtos/dto/login.dto';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { VerifyUserRoleDto } from 'src/users/dtos/dto/verify-user-role.dto';
import { PersonalInformationDto } from 'src/users/dtos/dto/personal-information.dto';

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

  async isEmailExists(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { email } });
    return count >= 1;
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
    await this.usersRepository.update({ id: userId }, { status: newUserStatus });
  }
}
