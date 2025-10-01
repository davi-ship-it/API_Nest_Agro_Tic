import { SetMetadata } from '@nestjs/common';

export const PERMISOS_KEY = 'permisos';

export const Permisos = (...permisos: { recurso: string; acciones: string[] }[]) =>
  SetMetadata(PERMISOS_KEY, permisos);

