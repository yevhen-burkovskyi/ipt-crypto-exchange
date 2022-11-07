import { Injectable } from '@nestjs/common';
import * as format from 'string-template';

import { EmailSubjectsEnum } from 'src/core/enums/email-subjects.enum';
import { SendEmailConfirmationDto } from 'src/modules/smtp/dtos/dto/send-email-confirmation.dto';
import { SendEmailDto } from 'src/modules/smtp/dtos/dto/send-email.dto';
import { SmtpService } from 'src/modules/smtp/services/smtp.service';
import { EmailTemplatesEnum } from 'src/core/enums/email-templates.enum';

@Injectable()
export class SmtpManager {
  constructor(private readonly smtpService: SmtpService) {}

  sendEmailConfirmation(payload: SendEmailConfirmationDto): Promise<void> {
    const sendEmailDto: SendEmailDto = {
      to: payload.userEmail,
      subject: EmailSubjectsEnum.APPROVE_EMAIL,
      text: format(EmailTemplatesEnum.APPROVE_EMAIL, { token: payload.token }),
    };
    return this.smtpService.sendEmail(sendEmailDto);
  }
}