import { Test, TestingModule } from '@nestjs/testing';
import { TipoUnidadService } from './tipo_unidad.service';

describe('TipoUnidadService', () => {
  let service: TipoUnidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoUnidadService],
    }).compile();

    service = module.get<TipoUnidadService>(TipoUnidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
