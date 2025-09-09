// src/auth/auth.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    HttpCode, 
    HttpStatus, 
    Patch, 
    Query,
    UseGuards, // Es buena práctica proteger endpoints sensibles
    Req 
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport'; // Asumiendo que usas JWT guard

import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
  
  // En una aplicación real, este endpoint debería estar protegido.
  // El ID del usuario se extrae del token JWT verificado, no del body.
  @UseGuards(AuthGuard('jwt')) 
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) { 
    const user = req.user as { sub: string }; // Extrae el usuario del token
    return this.authService.logout(user.sub);
  }

  /**
   * Endpoint para solicitar el restablecimiento de contraseña.
   * Recibe el correo electrónico del usuario.
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * Endpoint para establecer la nueva contraseña.
   * Recibe el token de la URL y la nueva contraseña del cuerpo de la solicitud.
   */
  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    // ✅ CAMBIO: Se pasa el DTO completo al servicio.
    return this.authService.resetPassword(token, resetPasswordDto);
  }
}