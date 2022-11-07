import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { UsersModule } from 'src/domains/users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        verifyOptions: { algorithms: ['HS256'] },
      }),
    }),
    UsersModule,
  ],
  providers: [JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
