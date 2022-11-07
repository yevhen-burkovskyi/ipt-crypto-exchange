import { hash, genSalt } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EncryptResponse } from 'src/modules/bcrypt/dtos/responses/encrypt.response';

@Injectable()
export class BcryptService {
  private readonly saltRounds: number;
  private readonly globalSalt: string;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = <number>this.configService.get('security.saltRounds');
    this.globalSalt = this.configService.get('security.globalSalt');
  }

  async encrypt(password: string): Promise<EncryptResponse> {
    const salt: string = await genSalt(this.saltRounds);
    const passwordWithGlobalSalt: string = password + this.globalSalt;
    const encryptedPassword: string = await hash(passwordWithGlobalSalt, salt);
    return { encryptedPassword, salt };
  }

  async encryptBySalt(password: string, userSalt: string): Promise<string> {
    const saltPassword: string = password + this.globalSalt;
    return await hash(saltPassword, userSalt);
  }
}
