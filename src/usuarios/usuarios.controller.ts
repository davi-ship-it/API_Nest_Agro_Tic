import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { Permisos } from 'src/permisos/decorators/permisos.decorator';
import { UpdateMeDto } from './dto/update-me.dto';
import { Request } from 'express';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(AuthenticationGuard)
  @Get('me')
  @ApiOperation({ summary: 'Retrieve current user information' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findMe(@Req() req: Request) {
    const userId = req['userId'];
    return this.usuariosService.findMe(userId);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Update current user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateMe(@Req() req: Request, @Body() updateMeDto: UpdateMeDto) {
    const userId = req['userId'];
    return this.usuariosService.updateMe(userId, updateMeDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUsuarioDto, @Req() req: any) {
    return this.usuariosService.createUserByPanel(createUserDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search users by query' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(
    @Param('query') query: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.usuariosService.search(query, page, limit);
  }

  @Get('search/dni/:dni')
  @ApiOperation({ summary: 'Find user by DNI' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findByDni(@Param('dni') dni: string) {
    return this.usuariosService.findByDni(+dni);
  }
}
