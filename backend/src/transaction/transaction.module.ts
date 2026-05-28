import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CreateTransactionHandler } from './commands/handlers/create-transaction.handler';
import { UpdateTransactionHandler } from './commands/handlers/update-transaction.handler';
import { DeleteTransactionHandler } from './commands/handlers/delete-transaction.handler';
import { ListTransactionsHandler } from './queries/handlers/list-transactions.handler';
import { GetTransactionByIdHandler } from './queries/handlers/get-transaction-by-id.handler';
import { GetTransactionSummaryHandler } from './queries/handlers/get-transaction-summary.handler';

@Module({
  imports: [CqrsModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepository,
    CreateTransactionHandler,
    UpdateTransactionHandler,
    DeleteTransactionHandler,
    ListTransactionsHandler,
    GetTransactionByIdHandler,
    GetTransactionSummaryHandler,
  ],
})
export class TransactionModule {}
