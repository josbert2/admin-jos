import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTemplateDto {
  @IsString() @MaxLength(200) title!: string;
  @IsString() @MaxLength(200) slug!: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() notes?: string;

  @IsOptional() @IsString() @MaxLength(500) websiteUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) sourceUrl?: string;

  @IsOptional() @IsString() @MaxLength(200) authorName?: string;
  @IsOptional() @IsString() @MaxLength(500) authorUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) authorImage?: string;

  @IsOptional() @IsString() @MaxLength(500) coverImage?: string;
  @IsOptional() @IsString() @MaxLength(500) mobileImage?: string;
  @IsOptional() @IsArray() images?: string[];

  @IsOptional() @IsArray() sections?: string[];
  @IsOptional() @IsArray() features?: string[];
  @IsOptional() @IsArray() categories?: string[];
  @IsOptional() @IsArray() styles?: string[];
  @IsOptional() @IsArray() typefaces?: string[];
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsArray() colors?: string[];
  @IsOptional() @IsArray() stack?: string[];

  @IsOptional() @IsDateString() publishedAt?: string;
  @IsOptional() @IsIn(['free', 'paid']) price?: 'free' | 'paid';
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsBoolean() isFavorite?: boolean;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateTemplateDto extends CreateTemplateDto {
  @IsOptional() @IsString() @MaxLength(200) declare title: string;
  @IsOptional() @IsString() @MaxLength(200) declare slug: string;
}
