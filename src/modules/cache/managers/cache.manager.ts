import { Injectable } from '@nestjs/common';

import { CacheService } from 'src/modules/cache/services/cache.service';

@Injectable()
export class CacheManager {
  constructor(private readonly cacheService: CacheService) {}

  async saveEmailTimeout(userId: string): Promise<void> {
    return this.cacheService.saveEmailTimeout(userId);
  }

  async emailTimeoutVerefication(userId: string): Promise<boolean> {
    const isEmailTimeoutExists = await this.cacheService.isEmailTimeoutExists(
      userId,
    );
    return !isEmailTimeoutExists;
  }
}
