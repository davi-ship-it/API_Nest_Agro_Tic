// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }


  @Post('login')
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    // Simplemente pasamos el token completo al servicio
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  
  // Este endpoint debería estar protegido por un Guard en una app real
  // @UseGuards(AuthGuard('jwt')) 
  @Post('logout')
  async logout(@Body('userId') userId: string) { // En un caso real, el userId vendría del token verificado
    return this.authService.logout(userId);
  }

  /*{
  "dni": 1122334455,
  "nombres": "Luisa Fernanda",
  "apellidos": "Mendez Rios",
  "correo": "luisa.pasante@example.com",
  "password": "unPasswordMuyComplejo!2025",
  "telefono": 3105558899,
  "rolId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",

  {
  "dni": 987654321,
  "password": "otraClaveFuerte456"
  
}
} */
}