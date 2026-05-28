import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { ListTransactionsQuery } from '../list-transactions.query';
import { TransactionRepository } from '../../transaction.repository';

@QueryHandler(ListTransactionsQuery)
export class ListTransactionsHandler implements IQueryHandler<ListTransactionsQuery> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(query: ListTransactionsQuery): Promise<Transaction[]> {
    return this.transactionRepository.findManyByUser(query.userId, query.filters);
  }
}
