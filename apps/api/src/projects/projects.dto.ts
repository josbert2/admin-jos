import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString() @MaxLength(200) title!: string;
  @IsString() @MaxLength(200) slug!: string;
  @IsOptional() @IsString() @MaxLength(500) summary?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() @MaxLength(500) coverImage?: string;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsArray() stack?: string[];
  @IsOptional() @IsString() @MaxLength(500) linkLive?: string;
  @IsOptional() @IsString() @MaxLength(500) linkRepo?: string;
  @IsOptional() @IsString() @MaxLength(200) client?: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() isBest?: boolean;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateProjectDto extends CreateProjectDto {
  @IsOptional() @IsString() @MaxLength(200) declare title: string;
  @IsOptional() @IsString() @MaxLength(200) declare slug: string;
}
