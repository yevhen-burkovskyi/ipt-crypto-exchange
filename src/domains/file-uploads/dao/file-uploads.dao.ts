import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FileUploadsEntity } from 'src/core/entities/file-uploads.entity';
import { ImageWithUser } from 'src/domains/file-uploads/dtos/types/image-with-user.type';

@Injectable()
export class FileUploadsDao {
  constructor(
    @InjectRepository(FileUploadsEntity)
    private readonly fileUploadsRepository: Repository<FileUploadsEntity>,
  ) {}

  async saveImage(payload: ImageWithUser): Promise<void> {
    await this.fileUploadsRepository.save(payload);
  }

  async countFilesByUserId(userId: string): Promise<number> {
    return this.fileUploadsRepository.count({
      where: { user: { id: userId } },
    });
  }
}
