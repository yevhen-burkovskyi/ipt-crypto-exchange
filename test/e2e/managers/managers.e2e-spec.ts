import { INestApplication } from '@nestjs/common';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { UsersManager } from 'src/domains/users/managers/users.manager';
import { TestUtils } from 'test/utils/test.utils';
import { CREATE_MANAGER, GENERATE_MANAGERS_ROUTE } from './managers.const';
import * as supertest from 'supertest';

describe('Managers (e2e)', () => {
  let app: INestApplication;
  let usersManager: UsersManager;
  let userAuthToken: string;

  beforeAll(async () => {
    app = await TestUtils.initApp();
    usersManager = app.get(UsersManager);
    userAuthToken = await TestUtils.takeTokenForUser(app);
  });

  describe('Create manager', () => {
    it('Should create manager', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() => Promise.resolve(UserStatusesEnum.ACTIVE));
      jest
        .spyOn(usersManager, 'isEmailExists')
        .mockImplementationOnce(() => Promise.resolve(false));

      await supertest(app.getHttpServer())
        .post(GENERATE_MANAGERS_ROUTE(''))
        .set(TestUtils.createBearerToken(userAuthToken))
        .send(CREATE_MANAGER)
        .expect(201);
    });
  });

  afterAll(() => app.close());
});
