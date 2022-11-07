import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/core/entities/user.entity';
import { UsersSerice } from 'src/domains/users/services/users.service';
import { UsersController } from 'src/domains/users/controllers/users.controller';
import { UsersDao } from 'src/domains/users/dao/users.dao';
import { UsersManager } from 'src/domains/users/managers/users.manager';
import { RolesModule } from 'src/modules/roles/roles.module';
import { SmtpModule } from 'src/modules/smtp/smtp.module';
import { CustomCacheModule } from 'src/modules/cache/cache.module';
import { BcryptModule } from 'src/modules/bcrypt/bcrypt.module';
import { TokenModule } from 'src/modules/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    RolesModule,
    SmtpModule,
    CustomCacheModule,
    BcryptModule,
    TokenModule,
  ],
  controllers: [UsersController],
  providers: [UsersSerice, UsersDao, UsersManager],
  exports: [UsersManager],
})
export class UsersModule {}
