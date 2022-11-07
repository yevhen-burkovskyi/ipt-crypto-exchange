import { CacheModule, Module } from '@nestjs/common';

import { CacheManager } from 'src/modules/cache/managers/cache.manager';
import { CacheService } from 'src/modules/cache/services/cache.service';

@Module({
  imports: [CacheModule.register()],
  providers: [CacheManager, CacheService],
  exports: [CacheManager],
})
export class CustomCacheModule {}
