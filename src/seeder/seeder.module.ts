// src/seeder/seeder.module.ts
import { Logger, Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AppModule } from '../app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/roles/entities/role.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { TipoUnidad } from 'src/tipo_unidad/entities/tipo_unidad.entity';
import { Ficha } from 'src/fichas/entities/ficha.entity';
import { Modulo } from 'src/modulos/entities/modulo.entity';
import { Recurso } from 'src/recursos/entities/recurso.entity';
import { Bodega } from 'src/bodega/entities/bodega.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Module({
  imports: [
    // Importamos AppModule para tener acceso a toda la configuración de la app,
    // como la conexión a la base de datos y variables de entorno.
    AppModule,
    // Al importar AppModule, ya tenemos acceso a los módulos de Usuarios y Permisos
    // y a sus providers exportados.
    // TypeOrmModule.forFeature es necesario aquí para que SeederService pueda inyectar los repositorios correspondientes.
    TypeOrmModule.forFeature([Roles, Usuario, Permiso, TipoUnidad, Ficha, Modulo, Recurso, Bodega, Categoria]),
  ],
  providers: [SeederService, Logger],
})
export class SeederModule {}
