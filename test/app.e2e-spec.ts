import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('app should be defined', () => {
    expect(app).toBeDefined();
  });

  it('GET /health', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK);
    expect(res.body).toHaveProperty('message', `I'm health`);
    expect(res.body).toHaveProperty('startedAt');
  });
});
