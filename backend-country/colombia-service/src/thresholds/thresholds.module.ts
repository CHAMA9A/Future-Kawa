import { Module } from '@nestjs/common';
import { ThresholdsController } from './thresholds.controller';

@Module({
  controllers: [ThresholdsController],
})
export class ThresholdsModule {}