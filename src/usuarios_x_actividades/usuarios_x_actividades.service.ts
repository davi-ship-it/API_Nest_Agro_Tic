import { Injectable } from '@nestjs/common';
import { CreateUsuariosXActividadeDto } from './dto/create-usuarios_x_actividade.dto';
import { UpdateUsuariosXActividadeDto } from './dto/update-usuarios_x_actividade.dto';

@Injectable()
export class UsuariosXActividadesService {
  create(createUsuariosXActividadeDto: CreateUsuariosXActividadeDto) {
    return 'This action adds a new usuariosXActividade';
  }

  findAll() {
    return `This action returns all usuariosXActividades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuariosXActividade`;
  }

  update(id: number, updateUsuariosXActividadeDto: UpdateUsuariosXActividadeDto) {
    return `This action updates a #${id} usuariosXActividade`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuariosXActividade`;
  }
}
