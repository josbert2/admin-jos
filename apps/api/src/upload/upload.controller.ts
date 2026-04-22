import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOrJwtGuard as JwtAuthGuard } from '../auth/api-or-jwt.guard';
import { UploadService } from './upload.service';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED = /^(image\/|application\/pdf$)/;

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED.test(file.mimetype)) {
          return cb(new BadRequestException('Tipo de archivo no permitido'), false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.service.upload(file, folder);
  }

  @Delete()
  async remove(@Body('key') key: string) {
    if (!key) throw new BadRequestException('key required');
    return this.service.delete(key);
  }
}
