import { Test, TestingModule } from '@nestjs/testing';
import { BodegaController } from './bodega.controller';
import { BodegaService } from './bodega.service';

describe('BodegaController', () => {
  let controller: BodegaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BodegaController],
      providers: [BodegaService],
    }).compile();

    controller = module.get<BodegaController>(BodegaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
