import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from './skills.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  list() {
    return this.service.findPublished();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  all() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  byId(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSkillDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
