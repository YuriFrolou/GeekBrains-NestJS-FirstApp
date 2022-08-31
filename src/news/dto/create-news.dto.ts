import { ArrayMinSize, IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNewsDto {

  @IsString()
  @MinLength(3)
  @MaxLength(22)
  title: string;

  @IsString()
  @MinLength(10)
  text: string;

  @IsOptional()
  thumbnail: string;

  @IsOptional()
  @IsString()
  attachment: string;
}
