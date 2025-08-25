import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateMapaDto {
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  urlImg: string;
}
