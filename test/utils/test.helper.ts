import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/database/database.service';
import { ValidationPipe } from '@nestjs/common';

export class TestHelper {
  static async initAppTestModule() {
    return await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseService],
    }).compile();
  }

  static async setupTestApp(testModule?: TestingModule) {
    const testAppModule = testModule || (await TestHelper.initAppTestModule());
    const app = testAppModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    return app;
  }
}
