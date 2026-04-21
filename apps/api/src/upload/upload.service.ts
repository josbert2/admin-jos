import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(config: ConfigService) {
    const accountId = config.getOrThrow<string>('R2_ACCOUNT_ID');
    this.bucket = config.getOrThrow<string>('R2_BUCKET');
    this.publicUrl = (config.get<string>('R2_PUBLIC_URL') ?? '').replace(/\/$/, '');

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload(file: Express.Multer.File, folder?: string) {
    if (!file) throw new BadRequestException('No file provided');

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
    const rand = randomBytes(4).toString('hex');
    const ts = Date.now();
    const key = [folder, `${ts}-${rand}-${safeName}`].filter(Boolean).join('/');

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    const url = this.publicUrl ? `${this.publicUrl}/${key}` : '';
    return { key, url, size: file.size, mimeType: file.mimetype };
  }

  async delete(key: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    return { ok: true };
  }
}
