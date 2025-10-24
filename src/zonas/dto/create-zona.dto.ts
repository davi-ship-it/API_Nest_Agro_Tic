import { IsString, IsNotEmpty, IsNumber, Length, IsOptional, IsObject, ValidateNested, ValidateBy } from 'class-validator';
import { Type } from 'class-transformer';

class GeoJSONGeometry {
  @IsString()
  @IsNotEmpty()
  type: 'Point' | 'Polygon';

  @IsNotEmpty()
  coordinates: any;
}

// Validation function for GeoJSON coordinates
function validateGeoJSONCoordinates(coordinates: any, type: string): boolean {
  if (type === 'Point') {
    return Array.isArray(coordinates) &&
           coordinates.length === 2 &&
           typeof coordinates[0] === 'number' &&
           typeof coordinates[1] === 'number' &&
           coordinates[0] >= -180 && coordinates[0] <= 180 &&
           coordinates[1] >= -90 && coordinates[1] <= 90;
  } else if (type === 'Polygon') {
    if (!Array.isArray(coordinates) || coordinates.length === 0) return false;
    const ring = coordinates[0];
    if (!Array.isArray(ring) || ring.length < 4) return false; // Polygon needs at least 4 points (closed)

    for (const coord of ring) {
      if (!Array.isArray(coord) || coord.length !== 2) return false;
      const [lng, lat] = coord;
      if (typeof lng !== 'number' || typeof lat !== 'number') return false;
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return false;
    }

    // Check if polygon is closed (first and last points should be the same)
    const first = ring[0];
    const last = ring[ring.length - 1];
    return first[0] === last[0] && first[1] === last[1];
  }
  return false;
}

export class CreateZonaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  coorX: number;

  @IsNumber()
  @IsNotEmpty()
  coorY: number;

  @IsNumber()
  @IsNotEmpty()
  areaMetrosCuadrados: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJSONGeometry)
  @ValidateBy({
    name: 'isValidGeoJSON',
    validator: {
      validate: (value: any) => {
        if (!value) return true; // Optional field
        if (typeof value !== 'object') return false;
        if (!value.type || !value.coordinates) return false;

        return validateGeoJSONCoordinates(value.coordinates, value.type);
      },
      defaultMessage: () => 'Invalid GeoJSON geometry format or coordinates out of bounds'
    }
  })
  coordenadas?: GeoJSONGeometry;
}
