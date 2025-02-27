import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { IdpService } from '../src/idp.service';
import { IdpModule } from './../src/idp.module';

describe('IdpController (e2e)', () => {
  let app: INestApplication;
  let idpService: IdpService;
  let httpServer;
  const testUser = {
    email: 'tester@gmail.com',
    password: 'scoobydoo',
  };
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IdpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    idpService = app.get(IdpService);
    httpServer = app.getHttpServer();

    // Cleanup the database before testing
    await idpService._clearDataBase();
  });

  it('/register (POST)', () => {
    return request(httpServer)
      .post('/register')
      .send(testUser)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('email');
        expect(body.email).toBe(testUser.email);
        expect(body).toHaveProperty('id');
        expect(Number(body.id)).not.toBeNaN();
        expect(body).toHaveProperty('createdAt');
        expect(new Date(body.createdAt)).toBeInstanceOf(Date);
        return true;
      });
  });

  it('/login (POST)', () => {
    // Check the user can login and receive a valid jwt
    return request(httpServer)
      .post('/login')
      .send(testUser)
      .expect(200)
      .expect(({ text }) => {
        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(0);
        jwtToken = text;
      });
  });

  it('/verify (GET)', () => {
    // Register a new test user
    return request(httpServer)
      .get('/verify')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send()
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
