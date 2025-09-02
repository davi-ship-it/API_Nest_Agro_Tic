import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_rol' })
  id: string;

  @Column({ name: 'rol_nombre', type: 'varchar', length: 50, unique: true })
  nombre: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
