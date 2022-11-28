import { Injectable } from '@nestjs/common';
import * as format from 'string-template';

import { SmtpService } from 'src/modules/smtp/services/smtp.service';
import { EmailSubjectsEnum } from 'src/core/enums/email-subjects.enum';
import { EmailTemplatesEnum } from 'src/core/enums/email-templates.enum';
import { SendEmailConfirmationDto } from 'src/modules/smtp/dtos/dto/send-email-confirmation.dto';
import { SendEmailDto } from 'src/modules/smtp/dtos/dto/send-email.dto';
import { SendEmailWithManagerCredentalsDto } from 'src/modules/smtp/dtos/dto/send-email-with-manager-credentals.dto';

@Injectable()
export class SmtpManager {
  constructor(private readonly smtpService: SmtpService) {}

  async sendEmailConfirmation(
    payload: SendEmailConfirmationDto,
  ): Promise<void> {
    const sendEmailDto: SendEmailDto = {
      to: payload.userEmail,
      subject: EmailSubjectsEnum.APPROVE_EMAIL,
      text: format(EmailTemplatesEnum.APPROVE_EMAIL, { token: payload.token }),
    };
    return this.smtpService.sendEmail(sendEmailDto);
  }

  async sendEmailWithManagerCredentals(
    payload: SendEmailWithManagerCredentalsDto,
  ): Promise<void> {
    const sendEmailDto: SendEmailDto = {
      to: payload.managerEmail,
      subject: EmailSubjectsEnum.MANAGER_PASSWORD,
      text: format(EmailTemplatesEnum.MANAGER_PASSWORD, {
        password: payload.password,
      }),
    };
    return this.smtpService.sendEmail(sendEmailDto);
  }

  async sendEmailToUsersThatBeenApproved(userEmails: string[]): Promise<void> {
    let sendEmailDto: SendEmailDto;

    userEmails.forEach((email: string) => {
      sendEmailDto = {
        to: email,
        subject: EmailSubjectsEnum.ACCOUNT_APPROVED,
        text: EmailTemplatesEnum.ACCOUNT_APPROVED,
      };

      this.smtpService.sendEmail(sendEmailDto);
    });
  }
}
