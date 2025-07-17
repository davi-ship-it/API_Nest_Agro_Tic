import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosXActividadesController } from './usuarios_x_actividades.controller';
import { UsuariosXActividadesService } from './usuarios_x_actividades.service';

describe('UsuariosXActividadesController', () => {
  let controller: UsuariosXActividadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosXActividadesController],
      providers: [UsuariosXActividadesService],
    }).compile();

    controller = module.get<UsuariosXActividadesController>(UsuariosXActividadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
