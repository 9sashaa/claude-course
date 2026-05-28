import { IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { UpdateCategoryInput } from '@expense-tracker/shared';

export class UpdateCategoryDto implements UpdateCategoryInput {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be a valid HEX color (e.g. #FF5733)' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}
