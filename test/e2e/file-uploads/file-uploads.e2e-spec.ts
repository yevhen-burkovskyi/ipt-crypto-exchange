import { INestApplication } from '@nestjs/common';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { FileUploadsManager } from 'src/domains/file-uploads/managers/file-uploads.manager';
import { UsersManager } from 'src/domains/users/managers/users.manager';
import { TestUtils } from 'test/utils/test.utils';
import { GENERATE_FILE_UPLOADS_ROUTE } from './file-uploads.const';
import { FILE_FIELD_NAME } from 'src/core/consts/file.consts';
import * as supertest from 'supertest';
import * as path from 'path';

describe('File Uploads (e2e)', () => {
  let app: INestApplication;
  let usersManager: UsersManager;
  let fileUploadsManager: FileUploadsManager;
  let userAuthToken: string;

  beforeAll(async () => {
    app = await TestUtils.initApp();
    usersManager = app.get(UsersManager);
    fileUploadsManager = app.get(FileUploadsManager);
    userAuthToken = await TestUtils.takeTokenForUser(app);
  });

  describe('File upload', () => {
    it('Should upload user file', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.PERSONALITY_VERIFICATION),
        );
      jest
        .spyOn(fileUploadsManager, 'isUserHaveUploadedImage')
        .mockImplementationOnce(() => Promise.resolve(false));
      jest
        .spyOn(fileUploadsManager, 'saveImage')
        .mockImplementationOnce(() =>
          Promise.resolve(TestUtils.generateBasicResponse()),
        );

      await supertest(app.getHttpServer())
        .post(GENERATE_FILE_UPLOADS_ROUTE(''))
        .set(TestUtils.createBearerToken(userAuthToken))
        .attach(
          FILE_FIELD_NAME,
          path.resolve(__dirname, './files-for-test/correct.jpeg'),
        )
        .expect(201);
    });

    it('Should return 403, file have incorrect size', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.PERSONALITY_VERIFICATION),
        );
      jest
        .spyOn(fileUploadsManager, 'isUserHaveUploadedImage')
        .mockImplementationOnce(() => Promise.resolve(false));
      jest
        .spyOn(fileUploadsManager, 'saveImage')
        .mockImplementationOnce(() =>
          Promise.resolve(TestUtils.generateBasicResponse()),
        );

      await supertest(app.getHttpServer())
        .post(GENERATE_FILE_UPLOADS_ROUTE(''))
        .set(TestUtils.createBearerToken(userAuthToken))
        .attach(
          FILE_FIELD_NAME,
          path.resolve(__dirname, './files-for-test/incorrect_size.jpg'),
        )
        .expect(403);
    });

    it('Should return 403, file have incorrect mimetype', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.PERSONALITY_VERIFICATION),
        );
      jest
        .spyOn(fileUploadsManager, 'isUserHaveUploadedImage')
        .mockImplementationOnce(() => Promise.resolve(false));
      jest
        .spyOn(fileUploadsManager, 'saveImage')
        .mockImplementationOnce(() =>
          Promise.resolve(TestUtils.generateBasicResponse()),
        );

      await supertest(app.getHttpServer())
        .post(GENERATE_FILE_UPLOADS_ROUTE(''))
        .set(TestUtils.createBearerToken(userAuthToken))
        .attach(
          FILE_FIELD_NAME,
          path.resolve(__dirname, './files-for-test/incorrect_mimetype.png'),
        )
        .expect(403);
    });
  });

  afterAll(() => app.close());
});
