import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { GetTransactionByIdQuery } from '../get-transaction-by-id.query';
import { TransactionRepository } from '../../transaction.repository';

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler implements IQueryHandler<GetTransactionByIdQuery> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(query: GetTransactionByIdQuery): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByIdAndUser(query.id, query.userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
