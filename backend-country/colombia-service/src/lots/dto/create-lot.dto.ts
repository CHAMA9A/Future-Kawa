import { IsString, IsOptional, IsDateString } from 'class-validator';

/**
 * CreateLotDto
 *
 * DTO (Data Transfer Object) qui définit la structure des données
 * attendues pour la création d'un lot de café.
 * Les décorateurs class-validator permettent la validation automatique.
 */
export class CreateLotDto {
  @IsString()
  lotCode: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsString()
  warehouseName: string;

  @IsDateString()
  storageDate: string;
}