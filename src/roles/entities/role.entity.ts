import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity'; // ajusta la ruta si es necesario

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_rol' })
  // Alternativa recomendada: @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ name: 'rol_nombre', type: 'varchar', length: 50 })
  nombre: string;

  // Relación con Usuario: un rol puede tener muchos usuarios
  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios?: Usuario[];
}

