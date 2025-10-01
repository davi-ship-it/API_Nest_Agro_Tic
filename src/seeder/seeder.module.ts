import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { Roles } from '../roles/entities/role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
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
import { Recurso } from 'src/recursos/entities/recurso.entity';
import { Bodega } from 'src/bodega/entities/bodega.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { PermisosModule } from '../permisos/permisos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { RolesModule } from '../roles/roles.module';
import { TipoUnidadModule } from '../tipo_unidad/tipo_unidad.module';
import { BodegaModule } from '../bodega/bodega.module';
import { CategoriaModule } from '../categoria/categoria.module';
import { RecursosModule } from '../recursos/recursos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsRun: false,
        logging: ['query', 'error'],
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') },
      }),
      global: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('MAIL_FROM')}>`,
        },
      }),
    }),
    // Importar módulos necesarios para los servicios
    PermisosModule,
    UsuariosModule,
    RolesModule,
    RecursosModule,
    TipoUnidadModule,
    BodegaModule,
    CategoriaModule,
    // AuthModule debe ir después de JwtModule y CacheModule
    AuthModule,
    // TypeOrmModule.forFeature es necesario aquí para que SeederService pueda inyectar los repositorios correspondientes.
    TypeOrmModule.forFeature([Roles, Usuario, Permiso, TipoUnidad, Ficha, TipoCultivo, Variedad, Cultivo, CultivosXVariedad, Zona, CultivosVariedadXZona, Actividad, UsuarioXActividad, Mapa, Cosecha, Epa, TipoEpa, CultivosXEpa, Sensor, TipoSensor, MedicionSensor, Venta, Recurso, Bodega, Categoria]),
  ],
  controllers: [SeederController],
  providers: [SeederService, Logger],
})
export class SeederModule {}
