import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionListQuery, TransactionType } from '@expense-tracker/shared';

export class ListTransactionsQueryDto implements TransactionListQuery {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'])
  type?: TransactionType;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
