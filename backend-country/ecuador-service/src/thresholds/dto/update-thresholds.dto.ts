import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TemperatureThresholdsDto {
  @ApiProperty({ description: 'Température minimale acceptable', example: 28 })
  @IsNumber()
  @Min(-20)
  @Max(60)
  min: number;

  @ApiProperty({ description: 'Température maximale acceptable', example: 34 })
  @IsNumber()
  @Min(-20)
  @Max(60)
  max: number;
}

class HumidityThresholdsDto {
  @ApiProperty({ description: 'Humidité minimale acceptable', example: 58 })
  @IsNumber()
  @Min(0)
  @Max(100)
  min: number;

  @ApiProperty({ description: 'Humidité maximale acceptable', example: 62 })
  @IsNumber()
  @Min(0)
  @Max(100)
  max: number;
}

export class UpdateThresholdsDto {
  @ApiProperty({ description: 'Seuils de température' })
  @ValidateNested()
  @Type(() => TemperatureThresholdsDto)
  temperature: TemperatureThresholdsDto;

  @ApiProperty({ description: 'Seuils d\'humidité' })
  @ValidateNested()
  @Type(() => HumidityThresholdsDto)
  humidity: HumidityThresholdsDto;
}
