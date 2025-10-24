// File: src/entities/zonas/zonas.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CultivosVariedadXZona } from '../../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';
import { Sensor } from '../../sensor/entities/sensor.entity';
import { MqttConfig } from '../../mqtt_config/entities/mqtt_config.entity';
import { MedicionSensor } from '../../medicion_sensor/entities/medicion_sensor.entity';

@Entity('zonas')
export class Zona {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_zona' })
  id: string;

  @Column({ name: 'zon_nombre', type: 'varchar', length: 50 })
  nombre: string;

  @Column({ name: 'zon_coor_x', type: 'numeric', precision: 10, scale: 2 })
  coorX: number;

  @Column({ name: 'zon_coor_y', type: 'numeric', precision: 10, scale: 2 })
  coorY: number;

  @Column({ name: 'zon_area_metros_cuadrados', type: 'numeric', precision: 10, scale: 2 })
  areaMetrosCuadrados: number;

  @Column({ name: 'zon_coordenadas', type: 'jsonb', nullable: true })
  coordenadas?: any; // Array de puntos [{lat: number, lng: number}]

  @OneToMany(() => CultivosVariedadXZona, (cvz) => cvz.zona)
  cultivosVariedad?: CultivosVariedadXZona[];

  @OneToOne(() => MqttConfig, (mc) => mc.zona)
  mqttConfig?: MqttConfig;

  @OneToMany(() => Sensor, (s) => s.zona)
  sensores?: Sensor[];

  @OneToMany(() => MedicionSensor, (ms) => ms.zona)
  mediciones?: MedicionSensor[];
}
