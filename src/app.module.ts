import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ActividadesModule } from './actividades/actividades.module';
import { BodegaModule } from './bodega/bodega.module';
import { CosechasModule } from './cosechas/cosechas.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { CultivosVariedadXZonaModule } from './cultivos_variedad_x_zona/cultivos_variedad_x_zona.module';
import { CultivosXEpaModule } from './cultivos_x_epa/cultivos_x_epa.module';
import { CultivosXVariedadModule } from './cultivos_x_variedad/cultivos_x_variedad.module';
import { EpaModule } from './epa/epa.module';
import { CategoriaModule } from './categoria/categoria.module';
import { MapasModule } from './mapas/mapas.module';
import { MedicionSensorModule } from './medicion_sensor/medicion_sensor.module';
import { SensorModule } from './sensor/sensor.module';
import { TipoCultivoModule } from './tipo_cultivo/tipo_cultivo.module';
import { TipoSensorModule } from './tipo_sensor/tipo_sensor.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosXActividadesModule } from './usuarios_x_actividades/usuarios_x_actividades.module';
import { VariedadModule } from './variedad/variedad.module';
import { VentaModule } from './venta/venta.module';
import { ZonasModule } from './zonas/zonas.module';
import { TipoEpaModule } from './tipo_epa/tipo_epa.module';
import { RolesModule } from './roles/roles.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { PermisosModule } from './permisos/permisos.module';
import { RecursosModule } from './recursos/recursos.module';
import { ModulosModule } from './modulos/modulos.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { FichasModule } from './fichas/fichas.module';
import { CategoriaActividadModule } from './categoria_actividad/categoria_actividad.module';
import { UnidadesMedidaModule } from './unidades_medida/unidades_medida.module';
import { ProductosModule } from './productos/productos.module';
import { LotesInventarioModule } from './lotes_inventario/lotes_inventario.module';
import { ReservasXActividadModule } from './reservas_x_actividad/reservas_x_actividad.module';
import { MovimientosInventarioModule } from './movimientos_inventario/movimientos_inventario.module';
import { TiposMovimientoModule } from './tipos_movimiento/tipos_movimiento.module';
import { EstadosReservaModule } from './estados_reserva/estados_reserva.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Módulo de Cache (Redis)
    CacheModule.registerAsync({
      isGlobal: true, // Hace el módulo disponible globalmente
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(
              configService.get<string>('REDIS_PORT') || '6379',
              10,
            ),
          },
        }),
      }),
    }),

    // 3. Módulo JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      global: true, // Hace el módulo JWT disponible globalmente
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: true, // O true si usas SSL/TLS
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Responder" <${configService.get<string>('MAIL_FROM')}>`,
        },
        // Aquí puedes configurar tu motor de plantillas (ej. Pug, EJS, Handlebars)
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: false,
        logging: ['query', 'error'],
      }),
    }),

    ActividadesModule,
    BodegaModule,
    CosechasModule,
    CultivosModule,
    CultivosVariedadXZonaModule,
    CultivosXEpaModule,
    CultivosXVariedadModule,
    EpaModule,
    CategoriaModule,
    MapasModule,
    MedicionSensorModule,
    SensorModule,
    TipoCultivoModule,
    TipoSensorModule,
    UsuariosModule, // Solo una vez
    UsuariosXActividadesModule,
    VariedadModule,
    VentaModule,
    ZonasModule,
    TipoEpaModule,
    RolesModule,
    AuthModule,
    PermisosModule,
    RecursosModule,
    ModulosModule,
    FichasModule,
    CategoriaActividadModule,
    UnidadesMedidaModule,
    ProductosModule,
    LotesInventarioModule,
    ReservasXActividadModule,
    MovimientosInventarioModule,
    TiposMovimientoModule,
    EstadosReservaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // Exporta los módulos para que otros módulos que importen AppModule (como SeederModule)
  // puedan acceder a los servicios que estos exportan.
  exports: [
    PermisosModule,
    UsuariosModule,
    BodegaModule,
    CategoriaModule,
  ],
})
export class AppModule {}
