import { HttpStatus, Injectable } from '@nestjs/common';

import { SaveImageDto } from 'src/domains/file-uploads/dtos/dto/save-image.dto';
import { FileUploadsService } from 'src/domains/file-uploads/services/file-uploads.service';
import { UsersManager } from 'src/domains/users/managers/users.manager';
import { ImageWithUser } from 'src/domains/file-uploads/dtos/types/image-with-user.type';
import { ServerUtils } from 'src/core/utils/server.utils';
import { FileResponsesEnum } from 'src/core/enums/file-responses.enum';
import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';

@Injectable()
export class FileUploadsManager {
  constructor(
    private readonly fileUploadsService: FileUploadsService,
    private readonly usersManager: UsersManager,
  ) {}

  async saveImage(payload: SaveImageDto): Promise<BasicResponse> {
    const userResponse = await this.usersManager.getUserByUserId(
      payload.userId,
    );
    const imageWithUser: ImageWithUser = {
      image: payload.image,
      user: userResponse.user,
    };

    await this.fileUploadsService.saveImage(imageWithUser);
    return ServerUtils.createCommonResponse(
      FileResponsesEnum.FILE_SAVED,
      HttpStatus.OK,
    );
  }

  async isUserHaveUploadedImage(userId: string): Promise<boolean> {
    return this.fileUploadsService.isUserHaveUploadedImage(userId);
  }
}
