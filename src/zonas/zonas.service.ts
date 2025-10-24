import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Raw } from 'typeorm';
import { Zona } from './entities/zona.entity';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { CultivosVariedadXZona } from '../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';

@Injectable()
export class ZonasService {
  private readonly logger = new Logger(ZonasService.name);

  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
    @InjectRepository(CultivosVariedadXZona)
    private readonly cvzRepository: Repository<CultivosVariedadXZona>,
  ) {}

  async create(createZonaDto: CreateZonaDto): Promise<Zona> {
    this.logger.log(`Creating new zona: ${createZonaDto.nombre}`);

    // Validate coordinates
    if (createZonaDto.coorX < -180 || createZonaDto.coorX > 180) {
      this.logger.error(`Invalid longitude: ${createZonaDto.coorX}`);
      throw new Error('Longitude must be between -180 and 180');
    }
    if (createZonaDto.coorY < -90 || createZonaDto.coorY > 90) {
      this.logger.error(`Invalid latitude: ${createZonaDto.coorY}`);
      throw new Error('Latitude must be between -90 and 90');
    }

    // Validate and convert coordinates to GeoJSON format
    let coordenadasGeoJSON: any = null;
    if (createZonaDto.coordenadas) {
      if (createZonaDto.coordenadas.type === 'Point') {
        // Point coordinates are already in [lng, lat] format
        const coords = createZonaDto.coordenadas.coordinates;
        if (Array.isArray(coords) && coords.length === 2) {
          coordenadasGeoJSON = {
            type: 'Point',
            coordinates: [coords[0], coords[1]]
          };
          this.logger.log(`Converted point coordinates to GeoJSON: ${JSON.stringify(coordenadasGeoJSON)}`);
        } else {
          this.logger.error(`Invalid point coordinates format: ${JSON.stringify(coords)}`);
          throw new Error('Invalid point coordinates format');
        }
      } else if (createZonaDto.coordenadas.type === 'Polygon') {
        // Polygon coordinates are already in [[lng, lat], ...] format from frontend
        const coords = createZonaDto.coordenadas.coordinates;
        if (Array.isArray(coords) && coords.length > 0 && Array.isArray(coords[0])) {
          // Validate each coordinate pair
          const validatedCoords = coords[0].map((coord: any) => {
            if (Array.isArray(coord) && coord.length === 2) {
              const [lng, lat] = coord;
              if (typeof lng === 'number' && typeof lat === 'number' &&
                  lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                return [lng, lat];
              }
            }
            this.logger.error(`Invalid polygon coordinate: ${JSON.stringify(coord)}`);
            throw new Error(`Invalid polygon coordinate: ${JSON.stringify(coord)}`);
          });

          coordenadasGeoJSON = {
            type: 'Polygon',
            coordinates: [validatedCoords]
          };
          this.logger.log(`Converted polygon coordinates to GeoJSON: ${JSON.stringify(coordenadasGeoJSON)}`);
        } else {
          this.logger.error(`Invalid polygon coordinates format: ${JSON.stringify(coords)}`);
          throw new Error('Invalid polygon coordinates format');
        }
      }
    }

    const zonaData = {
      ...createZonaDto,
      coordenadas: coordenadasGeoJSON
    };

    this.logger.log(`Saving zona with data: ${JSON.stringify(zonaData)}`);
    const zona = this.zonaRepository.create(zonaData);
    const savedZona = await this.zonaRepository.save(zona);
    this.logger.log(`Zona created successfully with ID: ${savedZona.id}`);

    return savedZona;
  }

  async findAll(): Promise<Zona[]> {
    this.logger.log('Fetching all zonas');
    const zonas = await this.zonaRepository.find();
    this.logger.log(`Found ${zonas.length} zonas`);

    // Convert GeoJSON back to frontend format for consistency
    return zonas.map(zona => ({
      ...zona,
      coordenadas: zona.coordenadas ? this.convertGeoJSONToFrontend(zona.coordenadas) : null
    }));
  }

  async search(query: string, page: number = 1, limit: number = 10) {
    console.log('Search query:', query, 'page:', page, 'limit:', limit);
    try {
      const skip = (page - 1) * limit;
      const qb = this.cvzRepository
        .createQueryBuilder('cvz')
        .leftJoinAndSelect('cvz.zona', 'zona')
        .leftJoinAndSelect('cvz.cultivoXVariedad', 'cxv')
        .leftJoinAndSelect('cxv.variedad', 'variedad')
        .leftJoinAndSelect('variedad.tipoCultivo', 'tipoCultivo')
        .where(
          'zona.nombre ILIKE :query OR variedad.nombre ILIKE :query OR tipoCultivo.nombre ILIKE :query',
          { query: `%${query}%` },
        )
        .skip(skip)
        .take(limit);

      console.log('Query SQL:', qb.getSql());
      const [items, total] = await qb.getManyAndCount();
      console.log('Items found:', items.length, 'total:', total);

      const mappedItems = items.map((item) => ({
        id: item.id,
        nombre: `${item.cultivoXVariedad?.variedad?.tipoCultivo?.nombre || 'Tipo'} - ${item.cultivoXVariedad?.variedad?.nombre || 'Variedad'} - ${item.zona?.nombre || 'Zona'}`,
        zonaId: item.zona?.id,
        cultivoId: item.cultivoXVariedad?.cultivo?.id,
        variedadNombre: item.cultivoXVariedad?.variedad?.nombre,
        tipoCultivoNombre: item.cultivoXVariedad?.variedad?.tipoCultivo?.nombre,
      }));
      console.log('Mapped items:', mappedItems.length);
      return {
        items: mappedItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error in zonas search:', error);
      throw error;
    }
  }

  async findByNombre(nombre: string): Promise<Zona[]> {
    return await this.zonaRepository.find({ where: { nombre } });
  }

  async findOne(id: number): Promise<Zona> {
    const zona = await this.zonaRepository.findOne({
      where: { id: id.toString() },
    });
    if (!zona) {
      throw new NotFoundException(`Zona con id ${id} no encontrada`);
    }
    return zona;
  }

  async update(id: number, updateZonaDto: UpdateZonaDto): Promise<Zona> {
    const zona = await this.findOne(id);
    Object.assign(zona, updateZonaDto);
    return await this.zonaRepository.save(zona);
  }

  async remove(id: number): Promise<void> {
    const zona = await this.findOne(id);
    await this.zonaRepository.remove(zona);
  }

  private convertGeoJSONToFrontend(geojson: any): any {
    if (!geojson) return null;

    if (geojson.type === 'Point') {
      // Ensure high precision for coordinates
      const [lng, lat] = geojson.coordinates;
      return {
        lat: parseFloat(lat.toFixed(8)),
        lng: parseFloat(lng.toFixed(8))
      };
    } else if (geojson.type === 'Polygon') {
      // Ensure high precision for polygon coordinates
      return geojson.coordinates[0].map((coord: [number, number]) => ({
        lat: parseFloat(coord[1].toFixed(8)),
        lng: parseFloat(coord[0].toFixed(8))
      }));
    }

    return geojson;
  }

  async getCultivosVariedadXZona(zonaId: string) {
    this.logger.log(`Fetching cultivos for zona: ${zonaId}`);
    const zona = await this.zonaRepository.findOne({
      where: { id: zonaId },
      relations: [
        'cultivosVariedad.cultivoXVariedad.cultivo',
        'cultivosVariedad.cultivoXVariedad.variedad',
        'cultivosVariedad.cultivoXVariedad.variedad.tipoCultivo',
      ],
    });

    if (!zona) {
      this.logger.error(`Zona with id ${zonaId} not found`);
      throw new NotFoundException(`Zona con id ${zonaId} no encontrada`);
    }

    this.logger.log(`Found zona ${zona.nombre} with ${zona.cultivosVariedad?.length || 0} cultivos`);

    return {
      zona: {
        id: zona.id,
        nombre: zona.nombre,
      },
      cultivos:
        zona.cultivosVariedad?.map((cvz) => ({
          cvzId: cvz.id,
          cultivo: {
            id: cvz.cultivoXVariedad?.cultivo?.id,
            nombre:
              cvz.cultivoXVariedad?.variedad?.tipoCultivo?.nombre ||
              'Tipo Cultivo',
            estado: cvz.cultivoXVariedad?.cultivo?.estado,
            fechaSiembra: cvz.cultivoXVariedad?.cultivo?.siembra,
          },
          variedad: {
            id: cvz.cultivoXVariedad?.variedad?.id,
            nombre: cvz.cultivoXVariedad?.variedad?.nombre,
          },
        })) || [],
    };
  }
}
