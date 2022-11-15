import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entities/user.entity';

import { ManagersController } from 'src/domains/managers/controllers/managers.controller';
import { ManagersDao } from 'src/domains/managers/dao/managers.dao';
import { ManagersManager } from 'src/domains/managers/managers/managers.manager';
import { ManagersService } from 'src/domains/managers/services/managers.service';
import { BcryptModule } from 'src/modules/bcrypt/bcrypt.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { SmtpModule } from 'src/modules/smtp/smtp.module';
import { UsersModule } from 'src/domains/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SmtpModule,
    RolesModule,
    BcryptModule,
    UsersModule,
  ],
  controllers: [ManagersController],
  providers: [ManagersManager, ManagersService, ManagersDao],
  exports: [ManagersManager],
})
export class ManagersModule {}
