import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionSummaryDto, TransactionType } from '@expense-tracker/shared';
import { GetTransactionSummaryQuery } from '../get-transaction-summary.query';
import { TransactionRepository } from '../../transaction.repository';

@QueryHandler(GetTransactionSummaryQuery)
export class GetTransactionSummaryHandler implements IQueryHandler<GetTransactionSummaryQuery> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(query: GetTransactionSummaryQuery): Promise<TransactionSummaryDto> {
    const groups = await this.transactionRepository.aggregateMonth(
      query.userId,
      query.month,
      query.year,
    );

    let totalIncome = 0;
    let totalExpense = 0;

    const byCategory = groups.map((g) => {
      const total = Number(g.total.toString());
      if (g.type === 'INCOME') totalIncome += total;
      else totalExpense += total;
      return { categoryId: g.categoryId, type: g.type as TransactionType, total };
    });

    return {
      month: query.month,
      year: query.year,
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      byCategory,
    };
  }
}
