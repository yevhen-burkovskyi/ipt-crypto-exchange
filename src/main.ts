import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { AuthModule } from 'src/modules/auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const jwtAuthGuard = app.select(AuthModule).get(JwtAuthGuard);
  app.useGlobalGuards(jwtAuthGuard);
  await app.listen(configService.get('app.port'));
}
bootstrap();
