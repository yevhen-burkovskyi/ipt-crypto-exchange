import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";

export class TestUtils {
    static async initServerForTest(): Promise<INestApplication> {
        let app: INestApplication;
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
      
        app = moduleFixture.createNestApplication();
        return app.init();
    }
}