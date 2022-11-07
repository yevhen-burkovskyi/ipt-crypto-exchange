import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesEntity } from 'src/core/entities/roles.entity';
import { RolesDao } from 'src/modules/roles/dao/roles.dao';
import { RolesManager } from 'src/modules/roles/managers/roles.manager';
import { RolesService } from 'src/modules/roles/services/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  providers: [RolesDao, RolesService, RolesManager],
  exports: [RolesManager],
})
export class RolesModule {}
