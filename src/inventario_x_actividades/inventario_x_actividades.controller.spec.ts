import { Test, TestingModule } from '@nestjs/testing';
import { InventarioXActividadesController } from './inventario_x_actividades.controller';
import { InventarioXActividadesService } from './inventario_x_actividades.service';

describe('InventarioXActividadesController', () => {
  let controller: InventarioXActividadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioXActividadesController],
      providers: [InventarioXActividadesService],
    }).compile();

    controller = module.get<InventarioXActividadesController>(InventarioXActividadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
