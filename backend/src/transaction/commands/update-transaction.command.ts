import { TransactionType } from '@expense-tracker/shared';

export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly data: {
      amount?: number;
      type?: TransactionType;
      description?: string | null;
      date?: Date;
      categoryId?: string;
    },
  ) {}
}
