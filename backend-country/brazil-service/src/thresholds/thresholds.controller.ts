import { Controller, Get, Put, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { getAlertThresholds, updateAlertThresholds, resetAlertThresholds } from '../config/alert-thresholds';
import { UpdateThresholdsDto } from './dto/update-thresholds.dto';

@ApiTags('thresholds')
@Controller('api/thresholds')
export class ThresholdsController {
  @Get()
  @ApiOperation({ summary: 'Get current alert thresholds for Brazil' })
  @ApiResponse({ status: 200, description: 'Current thresholds returned successfully' })
  getThresholds() {
    return getAlertThresholds();
  }

  @Put()
  @ApiOperation({ summary: 'Update alert thresholds for Brazil' })
  @ApiResponse({ status: 200, description: 'Thresholds updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid threshold values' })
  updateThresholds(@Body() dto: UpdateThresholdsDto) {
    const errors = validateThresholds(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '));
    }
    return updateAlertThresholds(dto);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset alert thresholds to defaults for Brazil' })
  @ApiResponse({ status: 200, description: 'Thresholds reset to defaults' })
  resetThresholds() {
    return resetAlertThresholds();
  }
}

function validateThresholds(dto: UpdateThresholdsDto): string[] {
  const errors: string[] = [];
  const { temperature, humidity } = dto;

  if (typeof temperature?.min !== 'number' || typeof temperature?.max !== 'number') {
    errors.push('temperature min and max must be numbers');
  } else {
    if (temperature.min < -20 || temperature.max > 60) {
      errors.push('temperature must be between -20 and 60');
    }
    if (temperature.min >= temperature.max) {
      errors.push('temperature min must be less than max');
    }
  }

  if (typeof humidity?.min !== 'number' || typeof humidity?.max !== 'number') {
    errors.push('humidity min and max must be numbers');
  } else {
    if (humidity.min < 0 || humidity.max > 100) {
      errors.push('humidity must be between 0 and 100');
    }
    if (humidity.min >= humidity.max) {
      errors.push('humidity min must be less than max');
    }
  }

  return errors;
}