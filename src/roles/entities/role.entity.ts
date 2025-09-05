import { Usuario } from '../../usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permiso } from '../../permisos/entities/permiso.entity';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_rol' })
  id: string;

  @Column({ name: 'rol_nombre', type: 'varchar', length: 50, unique: true })
  nombre: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];

  // ✅ Esta relación sigue siendo correcta y ahora apunta al nuevo "Permiso".
  @ManyToMany(() => Permiso, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'roles_permisos',
    joinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permiso_id',
      referencedColumnName: 'id',
    },
  })
  permisos: Permiso[];
}