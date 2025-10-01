// File: src/entities/cultivos/cultivo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm'; // Añadir ManyToOne y JoinColumn
import { CultivosXVariedad } from '../../cultivos_x_variedad/entities/cultivos_x_variedad.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity'; // Asegúrate de importar tu entidad Usuario

@Entity('cultivos')
export class Cultivo {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_cultivo' })
  id: string;

  @Column({ name: 'cul_estado', type: 'smallint', default: 1 })
  estado?: number;

  @Column({ name: 'cul_siembra', type: 'date', nullable: true })
  siembra?: Date;
  

  @Column({ name: 'fk_id_ficha', type: 'uuid', nullable: true }) 
  fk_id_ficha?: string;

  @OneToMany(() => CultivosXVariedad, (cxv) => cxv.cultivo)
  variedades?: CultivosXVariedad[];
}

