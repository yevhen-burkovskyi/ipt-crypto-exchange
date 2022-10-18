import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/core/entities/user.entity';
import { RegistrationDtoWithUserSalt } from 'src/users/services/types/registration-dto-with-user-salt.type';
import { LoginDto } from 'src/users/controllers/dto/login.dto';

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
}
