import { ConfigExModule } from '@libs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeAll(async () => {
    process.env.APP_VERSION = 'v0.0.0';

    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigExModule.forRoot()],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getVersion', () => {
    it('should return "v0.0.0"', () => {
      expect(appController.getVersion()).toBe('v0.0.0');
    });
  });
});
