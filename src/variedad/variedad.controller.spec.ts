import { Test, TestingModule } from '@nestjs/testing';
import { VariedadController } from './variedad.controller';
import { VariedadService } from './variedad.service';

describe('VariedadController', () => {
  let controller: VariedadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariedadController],
      providers: [VariedadService],
    }).compile();

    controller = module.get<VariedadController>(VariedadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
