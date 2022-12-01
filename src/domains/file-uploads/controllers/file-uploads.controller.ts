import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SetRole } from 'src/core/decorators/roles.decorator';
import { SetUserStatus } from 'src/core/decorators/user-status.decorator';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UserStatusesGuard } from 'src/core/guards/user-status.guard';
import { FileValidationPipe } from 'src/core/pipes/file-validation.pipe';
import { FileUploadsManager } from 'src/domains/file-uploads/managers/file-uploads.manager';
import { SaveImageDto } from 'src/domains/file-uploads/dtos/dto/save-image.dto';
import { Context } from 'src/core/decorators/user-context.decorator';
import { UserContext } from 'src/core/types/user-context.type';
import { MainRoutingEnum } from 'src/core/enums/main-routing.enum';
import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';
import { FileUploadOnceGuard } from 'src/core/guards/file-upload-once.guard';
import { FILE_FIELD_NAME } from 'src/core/consts/file.consts';

@Controller(MainRoutingEnum.FILE_UPLOADS)
export class FileUploadsController {
  constructor(private readonly fileUploadsManager: FileUploadsManager) {}

  @SetRole(RolesEnum.USER)
  @SetUserStatus(UserStatusesEnum.PERSONALITY_VERIFICATION)
  @UseGuards(RolesGuard, UserStatusesGuard, FileUploadOnceGuard)
  @Post()
  @UseInterceptors(FileInterceptor(FILE_FIELD_NAME))
  async upload(
    @UploadedFile(FileValidationPipe)
    file: Express.Multer.File,
    @Context()
    userContext: UserContext,
  ): Promise<BasicResponse> {
    const saveImageDto: SaveImageDto = {
      image: file.buffer.toString('base64'),
      userId: userContext.userId,
    };

    return this.fileUploadsManager.saveImage(saveImageDto);
  }
}
