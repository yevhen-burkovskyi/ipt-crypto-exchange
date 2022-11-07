import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { RequestWithUserContextType } from 'src/core/types/request-with-user-context.type';
import { FileUploadsManager } from 'src/domains/file-uploads/managers/file-uploads.manager';

@Injectable()
export class FileUploadOnceGuard implements CanActivate {
  constructor(private readonly fileUploadsManager: FileUploadsManager) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUserContextType = context
      .switchToHttp()
      .getRequest();
    const userId = request?.userContext?.userId;
    const isUserHaveUploadedImage =
      await this.fileUploadsManager.isUserHaveUploadedImage(userId);

    return !isUserHaveUploadedImage;
  }
}
