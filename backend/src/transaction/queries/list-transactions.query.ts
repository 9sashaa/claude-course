import { TransactionType } from '@expense-tracker/shared';

export class ListTransactionsQuery {
  constructor(
    public readonly userId: string,
    public readonly filters: {
      dateFrom?: Date;
      dateTo?: Date;
      type?: TransactionType;
      categoryId?: string;
    },
  ) {}
}
