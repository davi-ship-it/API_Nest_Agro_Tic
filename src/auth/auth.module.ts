// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Roles } from '../roles/entities/role.entity';

@Module({
  imports: [
    // Importa las entidades para que sus repositorios estén disponibles
    TypeOrmModule.forFeature([Usuario, Roles]),
    // JwtModule y CacheModule ya son globales, no es necesario re-importarlos
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}