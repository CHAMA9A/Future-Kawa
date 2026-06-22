import { Controller, Get, Post, Body } from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';

/**
 * LotsController
 *
 * Controller qui expose les routes API pour la gestion des lots de café.
 * Préfixe : /api/lots
 *
 * Routes :
 * - POST /api/lots       → Créer un lot
 * - GET  /api/lots       → Lister tous les lots
 * - GET  /api/lots/fifo  → Lister les lots triés par FIFO
 */
@Controller('api/lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  async create(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(createLotDto);
  }

  @Get()
  async findAll() {
    return this.lotsService.findAll();
  }

  @Get('fifo')
  async findFifo() {
    return this.lotsService.findFifo();
  }
}