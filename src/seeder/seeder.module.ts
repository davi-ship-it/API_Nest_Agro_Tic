import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { Roles } from '../roles/entities/role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { SeederService } from './seeder.service';
import { Permiso } from 'src/permisos/entities/permiso.entity';
import { TipoUnidad } from 'src/tipo_unidad/entities/tipo_unidad.entity';
import { Ficha } from 'src/fichas/entities/ficha.entity';
import { TipoCultivo } from 'src/tipo_cultivo/entities/tipo_cultivo.entity';
import { Variedad } from 'src/variedad/entities/variedad.entity';
import { Cultivo } from 'src/cultivos/entities/cultivo.entity';
import { CultivosXVariedad } from 'src/cultivos_x_variedad/entities/cultivos_x_variedad.entity';
import { Zona } from 'src/zonas/entities/zona.entity';
import { CultivosVariedadXZona } from 'src/cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';
import { Actividad } from 'src/actividades/entities/actividades.entity';
import { Mapa } from 'src/mapas/entities/mapa.entity';
import { UsuarioXActividad } from 'src/usuarios_x_actividades/entities/usuarios_x_actividades.entity';
import { Cosecha } from 'src/cosechas/entities/cosecha.entity';
import { Epa } from 'src/epa/entities/epa.entity';
import { TipoEpa } from 'src/tipo_epa/entities/tipo_epa.entity';
import { CultivosXEpa } from 'src/cultivos_x_epa/entities/cultivos_x_epa.entity';
import { Sensor } from 'src/sensor/entities/sensor.entity';
import { TipoSensor } from 'src/tipo_sensor/entities/tipo_sensor.entity';
import { MedicionSensor } from 'src/medicion_sensor/entities/medicion_sensor.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { Modulo } from 'src/modulos/entities/modulo.entity';
import { Recurso } from 'src/recursos/entities/recurso.entity';
import { Bodega } from 'src/bodega/entities/bodega.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';
import { InventarioXActividad } from 'src/inventario_x_actividades/entities/inventario_x_actividades.entity';

@Module({
  imports: [
    // Importamos AppModule para tener acceso a toda la configuración de la app,
    // como la conexión a la base de datos y variables de entorno.
    AppModule,
    // Al importar AppModule, ya tenemos acceso a los módulos de Usuarios y Permisos
    // y a sus providers exportados.
    // TypeOrmModule.forFeature es necesario aquí para que SeederService pueda inyectar los repositorios correspondientes.
    TypeOrmModule.forFeature([Roles, Usuario, Permiso, TipoUnidad, Ficha, TipoCultivo, Variedad, Cultivo, CultivosXVariedad, Zona, CultivosVariedadXZona, Actividad, UsuarioXActividad, Mapa, Cosecha, Epa, TipoEpa, CultivosXEpa, Sensor, TipoSensor, MedicionSensor, Venta, Modulo, Recurso, Bodega, Categoria, Inventario, InventarioXActividad]),
  ],
  providers: [SeederService, Logger],
})
export class SeederModule {}
