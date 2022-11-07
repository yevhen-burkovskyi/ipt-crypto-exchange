import { Module } from '@nestjs/common';

import { SmtpManager } from 'src/modules/smtp/managers/smtp.manager';
import { SmtpService } from 'src/modules/smtp/services/smtp.service';

@Module({
  providers: [SmtpService, SmtpManager],
  exports: [SmtpManager],
})
export class SmtpModule {}
