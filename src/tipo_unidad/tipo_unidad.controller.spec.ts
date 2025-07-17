import { Test, TestingModule } from '@nestjs/testing';
import { TipoUnidadController } from './tipo_unidad.controller';
import { TipoUnidadService } from './tipo_unidad.service';

describe('TipoUnidadController', () => {
  let controller: TipoUnidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoUnidadController],
      providers: [TipoUnidadService],
    }).compile();

    controller = module.get<TipoUnidadController>(TipoUnidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
