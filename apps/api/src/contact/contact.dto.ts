import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsString() @MaxLength(200) name!: string;
  @IsEmail() @MaxLength(200) email!: string;
  @IsOptional() @IsString() @MaxLength(300) subject?: string;
  @IsString() message!: string;
}

export class UpdateContactStatusDto {
  @IsIn(['new', 'read', 'archived'])
  status!: 'new' | 'read' | 'archived';
}
