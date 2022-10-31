import { INestApplication } from '@nestjs/common';
import { TestUtils } from 'test/test.utils';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await TestUtils.initServerForTest();
  });
});
