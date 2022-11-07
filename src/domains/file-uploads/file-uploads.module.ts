import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileUploadsEntity } from 'src/core/entities/file-uploads.entity';
import { UsersModule } from 'src/domains/users/users.module';
import { FileUploadsController } from 'src/domains/file-uploads/controllers/file-uploads.controller';
import { FileUploadsDao } from 'src/domains/file-uploads/dao/file-uploads.dao';
import { FileUploadsManager } from 'src/domains/file-uploads/managers/file-uploads.manager';
import { FileUploadsService } from 'src/domains/file-uploads/services/file-uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileUploadsEntity]), UsersModule],
  providers: [FileUploadsManager, FileUploadsService, FileUploadsDao],
  controllers: [FileUploadsController],
  exports: [FileUploadsManager],
})
export class FileUploadsModule {}
