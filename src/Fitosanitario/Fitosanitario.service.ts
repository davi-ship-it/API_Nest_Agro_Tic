import { Injectable } from '@nestjs/common';
import { CreateFitosanitarioDto } from './dto/create-fitosanitario.dto';
import { UpdateFitosanitarioDto } from './dto/update-fitosanitario.dto';
import { Fitosanitario } from './entities/fitosanitario.entity';

@Injectable()
export class FitosanitarioService {
  private fitosanitarios: Fitosanitario[] = [];

  findAll(nombre?: string): Fitosanitario[] {
    if (nombre) {
      return this.fitosanitarios.filter(f => f.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
    return this.fitosanitarios;
  }

  create(createFitosanitarioDto: CreateFitosanitarioDto): Fitosanitario {
    const nuevo: Fitosanitario = {
      id: Date.now(),
      ...createFitosanitarioDto,
    };
    this.fitosanitarios.push(nuevo);
    return nuevo;
  }

  update(id: number, updateFitosanitarioDto: UpdateFitosanitarioDto): Fitosanitario | null {
    const index = this.fitosanitarios.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.fitosanitarios[index] = { ...this.fitosanitarios[index], ...updateFitosanitarioDto };
    return this.fitosanitarios[index];
  }
}
