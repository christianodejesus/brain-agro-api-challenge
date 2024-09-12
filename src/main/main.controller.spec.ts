import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './main.controller';

describe('MainController', () => {
  let controller: MainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
    }).compile();

    controller = module.get<MainController>(MainController);
  });

  describe('GET /health', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return health data', () => {
      const healthData = controller.gethealth();
      expect(healthData).toHaveProperty('message', `I'm health`);
      expect(healthData).toHaveProperty('startedAt');
    });
  });
});
