import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioXActividad } from '../../usuarios_x_actividades/entities/usuarios_x_actividades.entity';
import { Roles } from 'src/roles/entities/role.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_usuario' })
  id: string;

  @Column({ name: 'usu_dni', type: 'bigint' })
  dni: number;

  @Column({ name: 'usu_nombres', type: 'varchar', length: 50 })
  nombres: string;

  @Column({ name: 'usu_apellidos', type: 'varchar', length: 50 })
  apellidos: string;

  @Column({ name: 'usu_password_h', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'usu_telefono', type: 'bigint'})
  telefono: number;

  @Column({ name: 'usu_correo', type: 'varchar', length: 255 })
  correo: string;

  // Relación ManyToOne hacia Roles (cada usuario tiene un rol)
  @ManyToOne(() => Roles, (r) => r.usuarios, { nullable: true })
  @JoinColumn({ name: 'fk_id_rol' }) // crea la columna fk_id_rol en la tabla usuarios
  rol?: Roles;

  @OneToMany(() => UsuarioXActividad, (uxa) => uxa.usuario)
  actividadesAsignadas?: UsuarioXActividad[];
}

