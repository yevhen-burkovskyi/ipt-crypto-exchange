import { Injectable } from '@nestjs/common';

import { FileUploadsDao } from 'src/domains/file-uploads/dao/file-uploads.dao';
import { ImageWithUser } from 'src/domains/file-uploads/dtos/types/image-with-user.type';

@Injectable()
export class FileUploadsService {
  constructor(private readonly fileUploadsDao: FileUploadsDao) {}

  async saveImage(payload: ImageWithUser): Promise<void> {
    return await this.fileUploadsDao.saveImage(payload);
  }

  async isUserHaveUploadedImage(userId: string): Promise<boolean> {
    const countOfUserImages = await this.fileUploadsDao.countFilesByUserId(
      userId,
    );
    return countOfUserImages >= 1;
  }
}
