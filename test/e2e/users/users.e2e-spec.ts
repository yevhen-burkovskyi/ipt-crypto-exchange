import { INestApplication } from '@nestjs/common';
import {
  CREATE_INCORRECT_OBJECT,
  EXCLUDE_PASSWORD_INFO_FROM_OBJECT,
  USER_WITH_PASSWORD_INFO,
  USER_FOR_REGISTRATION,
  USER_PERSONAL_INFORMATION,
  GENERATE_USER_RESPONSE,
  GENERATE_REGISTRATION_RESPONSE,
  APPROVE_EMAIL_QUERY,
  GENERATE_USERS_RESPONSE,
  APPROVE_USERS_IDENTITY,
  GENERATE_USER_ROUTE,
} from 'test/e2e/users/users.test-const';
import { UsersManager } from 'src/domains/users/managers/users.manager';
import { UsersRoutingEnum } from 'src/core/enums/users-routing.enum';
import { TestUtils } from 'test/utils/test.utils';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';
import { UsersSerice } from 'src/domains/users/services/users.service';
import { TokenManager } from 'src/modules/token/managers/token.managers';
import { SmtpManager } from 'src/modules/smtp/managers/smtp.manager';
import * as supertest from 'supertest';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  let usersManager: UsersManager;
  let usersService: UsersSerice;
  let tokenManager: TokenManager;
  let smtpManager: SmtpManager;
  let userAuthToken: string;

  beforeAll(async () => {
    app = await TestUtils.initApp();
    usersManager = app.get(UsersManager);
    usersService = app.get(UsersSerice);
    tokenManager = app.get(TokenManager);
    smtpManager = app.get(SmtpManager);
    userAuthToken = await TestUtils.takeTokenForUser(app);
  });

  describe('User registration', () => {
    it('Should register new user', async () => {
      jest
        .spyOn(usersManager, 'registration')
        .mockImplementationOnce(() =>
          Promise.resolve(GENERATE_REGISTRATION_RESPONSE()),
        );
      jest
        .spyOn(usersManager, 'isEmailExists')
        .mockImplementationOnce(() => Promise.resolve(false));

      await supertest(app.getHttpServer())
        .post(GENERATE_USER_ROUTE(UsersRoutingEnum.REGISTRATION))
        .send(USER_FOR_REGISTRATION)
        .expect(201);
    });

    it('Should return 403 when email isn`t unique', async () => {
      jest
        .spyOn(usersManager, 'isEmailExists')
        .mockImplementationOnce(() => Promise.resolve(true));

      await supertest(app.getHttpServer())
        .post(GENERATE_USER_ROUTE(UsersRoutingEnum.REGISTRATION))
        .send(USER_FOR_REGISTRATION)
        .expect(403);
    });

    it('Should return 400 since joi validation', async () => {
      jest
        .spyOn(usersManager, 'isEmailExists')
        .mockImplementationOnce(() => Promise.resolve(false));

      await supertest(app.getHttpServer())
        .post(GENERATE_USER_ROUTE(UsersRoutingEnum.REGISTRATION))
        .send(CREATE_INCORRECT_OBJECT(USER_FOR_REGISTRATION))
        .expect(400);
    });

    it('Should exclude password info from response', async () => {
      jest
        .spyOn(usersManager, 'registration')
        .mockImplementationOnce(() =>
          Promise.resolve(
            GENERATE_REGISTRATION_RESPONSE(USER_WITH_PASSWORD_INFO),
          ),
        );
      jest
        .spyOn(usersManager, 'isEmailExists')
        .mockImplementationOnce(() => Promise.resolve(false));

      await supertest(app.getHttpServer())
        .post(GENERATE_USER_ROUTE(UsersRoutingEnum.REGISTRATION))
        .send(USER_FOR_REGISTRATION)
        .expect(201)
        .then((response) => {
          expect(response.body.user).toEqual(
            EXCLUDE_PASSWORD_INFO_FROM_OBJECT(USER_WITH_PASSWORD_INFO),
          );
        });
    });
  });

  describe('User login', () => {
    it('Should user login', async () => {
      jest
        .spyOn(usersManager, 'login')
        .mockImplementationOnce(() =>
          Promise.resolve(GENERATE_REGISTRATION_RESPONSE()),
        );

      await supertest(app.getHttpServer())
        .post(GENERATE_USER_ROUTE(UsersRoutingEnum.LOGIN))
        .send(USER_FOR_REGISTRATION)
        .expect(200);
    });
  });

  describe('User set personal information', () => {
    it('Should set personal information', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.I_AM_NEW_HERE),
        );
      jest
        .spyOn(usersManager, 'setUserPersonalInformation')
        .mockImplementationOnce(() => Promise.resolve());
      jest
        .spyOn(usersManager, 'getUserByUserId')
        .mockImplementationOnce(() =>
          Promise.resolve(GENERATE_USER_RESPONSE()),
        );

      await supertest(app.getHttpServer())
        .patch(GENERATE_USER_ROUTE(UsersRoutingEnum.PERSONAL_INFORMATION))
        .set(TestUtils.createBearerToken(userAuthToken))
        .send(USER_PERSONAL_INFORMATION)
        .expect(200);
    });

    it('Should return 400 status if user is underage', async () => {
      const payloadWithIncorrectDOB = {
        ...USER_PERSONAL_INFORMATION,
        DOB: new Date(),
      };

      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.I_AM_NEW_HERE),
        );

      await supertest(app.getHttpServer())
        .patch(GENERATE_USER_ROUTE(UsersRoutingEnum.PERSONAL_INFORMATION))
        .set(TestUtils.createBearerToken(userAuthToken))
        .send(payloadWithIncorrectDOB)
        .expect(400);
    });
  });

  describe('Send email to user', () => {
    it('Should send email for user', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.EMAIL_VERIFICATION),
        );
      jest
        .spyOn(usersManager, 'sendEmailApprove')
        .mockImplementationOnce(() =>
          Promise.resolve(TestUtils.generateBasicResponse()),
        );

      await supertest(app.getHttpServer())
        .get(GENERATE_USER_ROUTE(UsersRoutingEnum.SEND_EMAIL_APPROVE))
        .set(TestUtils.createBearerToken(userAuthToken))
        .expect(200);
    });

    it('Should add email timeout for user', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.EMAIL_VERIFICATION),
        );
      jest
        .spyOn(usersService, 'getUserEmailByUserId')
        .mockImplementationOnce(() => Promise.resolve(''));
      jest
        .spyOn(tokenManager, 'createEmailApproveToken')
        .mockImplementationOnce(() => '');
      jest
        .spyOn(smtpManager, 'sendEmailConfirmation')
        .mockImplementationOnce(() => Promise.resolve());

      await supertest(app.getHttpServer())
        .get(GENERATE_USER_ROUTE(UsersRoutingEnum.SEND_EMAIL_APPROVE))
        .set(TestUtils.createBearerToken(userAuthToken))
        .expect(200);

      /* Second request to trigger timeout guard */

      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() =>
          Promise.resolve(UserStatusesEnum.EMAIL_VERIFICATION),
        );

      await supertest(app.getHttpServer())
        .get(GENERATE_USER_ROUTE(UsersRoutingEnum.SEND_EMAIL_APPROVE))
        .set(TestUtils.createBearerToken(userAuthToken))
        .expect(403);
    });
  });

  describe('Approve user email', () => {
    it('Should approve user email', async () => {
      jest
        .spyOn(usersManager, 'activateUserEmail')
        .mockImplementationOnce(() =>
          Promise.resolve(GENERATE_USER_RESPONSE()),
        );

      await supertest(app.getHttpServer())
        .get(GENERATE_USER_ROUTE(UsersRoutingEnum.APPROVE_EMAIL))
        .query(APPROVE_EMAIL_QUERY)
        .expect(200);
    });
  });

  describe('Get waiting users for approve', () => {
    it('Should return users that end KYC', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() => Promise.resolve(UserStatusesEnum.ACTIVE));
      jest
        .spyOn(usersManager, 'getWaitingUsersForApprove')
        .mockImplementationOnce(() =>
          Promise.resolve(GENERATE_USERS_RESPONSE()),
        );

      await supertest(app.getHttpServer())
        .get(
          GENERATE_USER_ROUTE(UsersRoutingEnum.GET_WAITING_USERS_FOR_APPROVE),
        )
        .set(TestUtils.createBearerToken(userAuthToken))
        .query(TestUtils.generatePaginationPayload())
        .expect(200);
    });
  });

  describe('Approve users identity', () => {
    it('Should approve users identity', async () => {
      jest
        .spyOn(usersManager, 'getUserStatusById')
        .mockImplementationOnce(() => Promise.resolve(UserStatusesEnum.ACTIVE));
      jest
        .spyOn(usersManager, 'approveUsersIdentity')
        .mockImplementationOnce(() =>
          Promise.resolve(TestUtils.generateBasicResponse()),
        );

      await supertest(app.getHttpServer())
        .post(GENERATE_USER_ROUTE(UsersRoutingEnum.APPROVE_USERS_IDENTITY))
        .set(TestUtils.createBearerToken(userAuthToken))
        .send(APPROVE_USERS_IDENTITY)
        .expect(200);
    });
  });

  afterAll(() => app.close());
});