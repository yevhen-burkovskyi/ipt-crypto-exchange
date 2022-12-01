import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UsersRoutingEnum } from 'src/core/enums/users-routing.enum';
import { UsersSerice } from 'src/domains/users/services/users.service';
import { BcryptManager } from 'src/modules/bcrypt/managers/bcrypt.manager';
import {
  USER_WITH_PASSWORD_INFO,
  USER_FOR_REGISTRATION,
  GENERATE_USER_ROUTE,
} from 'test/e2e/users/users.test-const';
import { UserStatusesGuard } from 'src/core/guards/user-status.guard';
import { MOCK_GUARD } from 'test/utils/test.conts';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { BasicResponse } from 'src/core/utils/dtos/responses/basic.response';
import { Pagination } from 'src/core/types/pagination.type';
import * as supertest from 'supertest';

type HeaderWithAuthorization = { Authorization: string };

export class TestUtils {
  static async initApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(UserStatusesGuard)
      .useValue(MOCK_GUARD)
      .overrideGuard(RolesGuard)
      .useValue(MOCK_GUARD)
      .compile();
    const app = moduleFixture.createNestApplication();
    const jwtAuthGuard = app.select(AuthModule).get(JwtAuthGuard);

    app.useGlobalGuards(jwtAuthGuard);

    await app.init();

    return app;
  }

  static async takeTokenForUser(app: INestApplication): Promise<string> {
    const userService = app.get(UsersSerice);
    const bcryptManager = app.get(BcryptManager);

    jest
      .spyOn(userService, 'getUserSaltByEmail')
      .mockImplementationOnce(() => Promise.resolve(null));
    jest
      .spyOn(userService, 'login')
      .mockImplementationOnce(() => Promise.resolve(USER_WITH_PASSWORD_INFO));
    jest
      .spyOn(bcryptManager, 'encryptBySalt')
      .mockImplementationOnce(() => Promise.resolve(null));

    const res = await supertest(app.getHttpServer())
      .post(GENERATE_USER_ROUTE(UsersRoutingEnum.LOGIN))
      .send(USER_FOR_REGISTRATION);

    return res.body.token;
  }

  static createBearerToken(token: string): HeaderWithAuthorization {
    return { Authorization: `Bearer ${token}` };
  }

  static generateBasicResponse(): BasicResponse {
    return { message: 'Some message', statusCode: HttpStatus.OK };
  }

  static generatePaginationPayload(): Pagination {
    return { limit: 10, offset: 0 };
  }
}
