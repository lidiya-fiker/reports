import { Test, TestingModule } from '@nestjs/testing';
import { ResponceController } from './response.controller';
import { ResponceService } from './response.service';

describe('ResponceController', () => {
  let controller: ResponceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponceController],
      providers: [ResponceService],
    }).compile();

    controller = module.get<ResponceController>(ResponceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
