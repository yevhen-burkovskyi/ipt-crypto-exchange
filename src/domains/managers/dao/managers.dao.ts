import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/core/entities/user.entity';
import { RegisterNewManagerDto } from 'src/domains/managers/dtos/dto/register-new-manager.dto';

@Injectable()
export class ManagersDao {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRespository: Repository<UserEntity>,
  ) {}

  async registerNewManager(payload: RegisterNewManagerDto): Promise<void> {
    await this.usersRespository.save(payload);
  }
}
