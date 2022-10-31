import { Module } from '@nestjs/common';
import { SmtpManager } from 'src/smtp/managers/smtp.manager';
import { SmtpService } from 'src/smtp/services/smtp.service';

@Module({
  providers: [SmtpService, SmtpManager],
  exports: [SmtpManager],
})
export class SmtpModule {}
