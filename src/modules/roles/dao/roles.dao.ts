import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolesEntity } from 'src/core/entities/roles.entity';
import { RolesEnum } from 'src/core/enums/roles.enum';

@Injectable()
export class RolesDao {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}

  getAllRoles(): Promise<RolesEntity[]> {
    return this.rolesRepository.find();
  }

  getRoleByName(name: RolesEnum): Promise<RolesEntity> {
    return this.rolesRepository.findOne({ where: { name } });
  }
}
