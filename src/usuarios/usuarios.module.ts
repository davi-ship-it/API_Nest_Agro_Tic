import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Roles } from '../roles/entities/role.entity';


@Module({
  imports: [
    // La línea clave que probablemente te falta o está incompleta:
    TypeOrmModule.forFeature([Usuario, Roles]) 
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
