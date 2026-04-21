import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateSkillDto {
  @IsString() @MaxLength(120) name!: string;
  @IsOptional() @IsString() @MaxLength(120) category?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) level?: number;
  @IsOptional() @IsString() @MaxLength(500) icon?: string;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateSkillDto extends CreateSkillDto {
  @IsOptional() @IsString() @MaxLength(120) declare name: string;
}
