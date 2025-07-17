import { Test, TestingModule } from '@nestjs/testing';
import { InventarioXActividadesService } from './inventario_x_actividades.service';

describe('InventarioXActividadesService', () => {
  let service: InventarioXActividadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventarioXActividadesService],
    }).compile();

    service = module.get<InventarioXActividadesService>(InventarioXActividadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
