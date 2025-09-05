import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisosService } from './permisos.service';
// Asumo que tienes un controlador, si no, puedes eliminar esta línea
import { PermisosController } from './permisos.controller';
import { Permiso } from './entities/permiso.entity';
import { Recurso } from '../recursos/entities/recurso.entity';

@Module({
  imports: [
    // ✅ CORRECCIÓN: Añade la entidad 'Recurso' al arreglo de forFeature.
    // Esto hace que RecursoRepository esté disponible para inyección en este módulo.
    TypeOrmModule.forFeature([Permiso, Recurso]),
  ],
  controllers: [PermisosController], // Asumo que tienes un controlador
  providers: [PermisosService],
})
export class PermisosModule {}
