import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
    private emailTimeoutKey = 'EMAIL_TIMEOUT';
    private emailTimeout: number;

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
        private readonly configService: ConfigService,
    ) {
        this.emailTimeout = this.configService.get('timeouts.emailConfirm');
    }

    async saveEmailTimeout(userId: string): Promise<void> {
        await this.cacheService.set(this.createEmailTimeoutKey(userId), true, this.emailTimeout);
    }

    async isEmailTimeoutExists(userId: string): Promise<boolean> {
        const emailTimeout = await this.cacheService.get(this.createEmailTimeoutKey(userId));
        return !!emailTimeout;
    }

    private createEmailTimeoutKey(userId: string): string {
        return this.emailTimeoutKey + '_' + userId;
    }
}