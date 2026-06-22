import { IsString, IsNumber } from 'class-validator';

/**
 * CreateMeasurementDto
 *
 * DTO pour la création d'une mesure IoT.
 * Valide que warehouseName est une chaîne, temperature et humidity sont des nombres.
 */
export class CreateMeasurementDto {
  @IsString()
  warehouseName: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;
}