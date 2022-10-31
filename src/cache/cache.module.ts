import { CacheModule, Module } from "@nestjs/common";
import { CacheManager } from "src/cache/managers/cache.manager";
import { CacheService } from "src/cache/services/cache.service";

@Module({
    imports: [CacheModule.register()],
    providers: [CacheManager, CacheService],
    exports: [CacheManager],
})
export class CustomCacheModule {}