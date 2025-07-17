import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosXActividadesService } from './usuarios_x_actividades.service';

describe('UsuariosXActividadesService', () => {
  let service: UsuariosXActividadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosXActividadesService],
    }).compile();

    service = module.get<UsuariosXActividadesService>(UsuariosXActividadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
