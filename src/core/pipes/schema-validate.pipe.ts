import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ErrorMessagesEnum } from 'src/core/enums/error-messages.enum';

@Injectable()
export class SchemaValidatePipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new HttpException(ErrorMessagesEnum.JOI, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
