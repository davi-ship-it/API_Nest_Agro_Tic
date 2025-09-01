import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
   
  ) {}

  findByCorreo(correo: string) {
    return this.userRepo.findOne({ where: { correo } });
  }

  findByDni(dni: number) {
    return this.userRepo.findOne({ where: { dni } });
  }

}

