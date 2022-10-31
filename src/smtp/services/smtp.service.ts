import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DefaultFromForMail, Service } from 'src/core/consts/mail.consts';
import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';
import { SendEmailDto } from 'src/smtp/dtos/dto/send-email.dto';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class SmtpService {
  private transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      service: Service,
      auth: {
        user: this.configService.get('nodemailer.user'),
        pass: this.configService.get('nodemailer.password'),
      },
    });
  }

  async sendEmail(payload: SendEmailDto): Promise<void> {
    try {
      await this.transport.sendMail({
        from: DefaultFromForMail,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
      });
    } catch (e) {
      throw new HttpException(
        ErrorMessagesEnum.EMAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
