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
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactStatusDto } from './contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  // Public — form submission
  @Post()
  submit(@Body() dto: CreateContactDto) {
    return this.service.create(dto);
  }

  // Admin
  @UseGuards(JwtAuthGuard)
  @Get()
  list() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  byId(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
