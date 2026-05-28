import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { CreateCategoryInput } from '@expense-tracker/shared';

export class CreateCategoryDto implements CreateCategoryInput {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be a valid HEX color (e.g. #FF5733)' })
  color!: string;

  @IsString()
  @MaxLength(50)
  icon!: string;
}
