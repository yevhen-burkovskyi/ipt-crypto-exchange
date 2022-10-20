import { Injectable } from '@nestjs/common';

import { RolesEntity } from 'src/core/entities/roles.entity';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { RolesDao } from 'src/roles/dao/roles.dao';

@Injectable()
export class RolesService {
  constructor(private readonly rolesDao: RolesDao) {}

  async getAllRoles(): Promise<RolesEntity[]> {
    return this.rolesDao.getAllRoles();
  }

  async getRoleByName(name: RolesEnum): Promise<RolesEntity> {
    return this.rolesDao.getRoleByName(name);
  }
}
