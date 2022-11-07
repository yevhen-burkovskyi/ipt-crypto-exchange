import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TokenManager } from 'src/modules/token/managers/token.managers';
import { TokenService } from 'src/modules/token/services/token.service';

@Module({
  imports: [
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
  ],
  providers: [TokenManager, TokenService],
  exports: [TokenManager],
})
export class TokenModule {}
