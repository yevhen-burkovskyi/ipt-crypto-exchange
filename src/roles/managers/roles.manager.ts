import { Injectable } from '@nestjs/common';

import { RolesEntity } from 'src/core/entities/roles.entity';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { RolesService } from 'src/roles/services/roles.service';

@Injectable()
export class RolesManager {
  constructor(private readonly rolesService: RolesService) {}

  async getAllRoles(): Promise<RolesEntity[]> {
    return this.rolesService.getAllRoles();
  }

  async getRoleByName(name: RolesEnum): Promise<RolesEntity> {
    return this.rolesService.getRoleByName(name);
  }
}
