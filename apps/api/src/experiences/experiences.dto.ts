import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExperienceDto {
  @IsString() @MaxLength(200) company!: string;
  @IsString() @MaxLength(200) role!: string;
  @IsOptional() @IsString() @MaxLength(200) location?: string;
  @IsOptional() @IsString() description?: string;
  @IsDateString() startDate!: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsBoolean() current?: boolean;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateExperienceDto extends CreateExperienceDto {
  @IsOptional() @IsString() @MaxLength(200) declare company: string;
  @IsOptional() @IsString() @MaxLength(200) declare role: string;
  @IsOptional() @IsDateString() declare startDate: string;
}
