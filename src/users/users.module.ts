import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { UserEntity } from 'src/core/entities/user.entity';
import { BcryptService } from 'src/users/services/bcrypt.service';
import { UsersSerice } from 'src/users/services/users.service';
import { TokenService } from 'src/users/services/token.service';
import { UsersController } from 'src/users/controllers/users.controller';
import { UsersDao } from 'src/users/dao/users.dao';
import { UsersManager } from 'src/users/managers/users.manager';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        verifyOptions: { algorithms: ['HS256'] },
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
    }),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersSerice, BcryptService, TokenService, UsersDao, UsersManager],
  exports: [UsersManager],
})
export class UsersModule {}
