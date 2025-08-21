// File: src/entities/usuarios/usuarios.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioXActividad } from '../../usuarios_x_actividades/entities/usuarios_x_actividades.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'pk_id_usuario' })
  id: number;

  @Column({ name: 'usu_nombres', type: 'varchar', length: 50 })
  nombres: string;

  @Column({ name: 'usu_apellidos', type: 'varchar', length: 50 })
  apellidos: string;

  @Column({ name: 'usu_password_h', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'usu_telefono', type: 'bigint', nullable: true })
  telefono?: number;

  @Column({ name: 'usu_correo', type: 'varchar', length: 255 })
  correo: string;

  @Column({ name: 'usu_rol', type: 'varchar', length: 8 })
  rol: string;

  @Column({ name: 'usu_dni', type: 'bigint' })
  dni: number;

  @OneToMany(() => UsuarioXActividad, (uxa) => uxa.usuario)
  actividadesAsignadas?: UsuarioXActividad[];
}
