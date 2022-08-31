import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber, IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  newsId: string;

  @IsString()
  @MinLength(10)
  text: string;

  @IsOptional()
  @IsString()
  attachment: string;
}
