import { PipeTransform, Injectable, ForbiddenException } from '@nestjs/common';
import { OneMb, FileNameLength, FileMimeTypes } from '../consts/file.consts';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const fieldsExists =
      value?.originalname?.length && value?.size && value?.mimetype;
    const isFileValid =
      fieldsExists &&
      FileMimeTypes.includes(value.mimetype) &&
      value.size < OneMb &&
      value.originalname.length < FileNameLength;

    if (!isFileValid) throw new ForbiddenException();

    return value;
  }
}
