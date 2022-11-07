import { Injectable } from '@nestjs/common';

import { EncryptResponse } from 'src/modules/bcrypt/dtos/responses/encrypt.response';
import { BcryptService } from 'src/modules/bcrypt/services/bcrypt.service';

@Injectable()
export class BcryptManager {
  constructor(private readonly bcryptService: BcryptService) {}

  async encrypt(password: string): Promise<EncryptResponse> {
    return this.bcryptService.encrypt(password);
  }

  async encryptBySalt(password: string, userSalt: string): Promise<string> {
    return this.bcryptService.encryptBySalt(password, userSalt);
  }
}
