import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BcryptManager } from 'src/modules/bcrypt/managers/bcrypt.manager';
import { BcryptService } from 'src/modules/bcrypt/services/bcrypt.service';

@Module({
  imports: [ConfigModule],
  providers: [BcryptManager, BcryptService],
  exports: [BcryptManager],
})
export class BcryptModule {}
