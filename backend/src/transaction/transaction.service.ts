import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { TransactionDto, TransactionSummaryDto } from '@expense-tracker/shared';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions.query.dto';
import { TransactionSummaryQueryDto } from './dto/transaction-summary.query.dto';
import { CreateTransactionCommand } from './commands/create-transaction.command';
import { UpdateTransactionCommand } from './commands/update-transaction.command';
import { DeleteTransactionCommand } from './commands/delete-transaction.command';
import { ListTransactionsQuery } from './queries/list-transactions.query';
import { GetTransactionByIdQuery } from './queries/get-transaction-by-id.query';
import { GetTransactionSummaryQuery } from './queries/get-transaction-summary.query';

@Injectable()
export class TransactionService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateTransactionDto, userId: string): Promise<TransactionDto> {
    const transaction = await this.commandBus.execute<CreateTransactionCommand, Transaction>(
      new CreateTransactionCommand(
        dto.amount,
        dto.type,
        new Date(dto.date),
        dto.categoryId,
        userId,
        dto.description,
      ),
    );
    return this.toTransactionDto(transaction);
  }

  async findAll(userId: string, queryDto: ListTransactionsQueryDto): Promise<TransactionDto[]> {
    const transactions = await this.queryBus.execute<ListTransactionsQuery, Transaction[]>(
      new ListTransactionsQuery(userId, {
        dateFrom: queryDto.dateFrom ? new Date(queryDto.dateFrom) : undefined,
        dateTo: queryDto.dateTo ? new Date(queryDto.dateTo) : undefined,
        type: queryDto.type,
        categoryId: queryDto.categoryId,
      }),
    );
    return transactions.map((t) => this.toTransactionDto(t));
  }

  async findOne(id: string, userId: string): Promise<TransactionDto> {
    const transaction = await this.queryBus.execute<GetTransactionByIdQuery, Transaction>(
      new GetTransactionByIdQuery(id, userId),
    );
    return this.toTransactionDto(transaction);
  }

  async getSummary(userId: string, queryDto: TransactionSummaryQueryDto): Promise<TransactionSummaryDto> {
    return this.queryBus.execute<GetTransactionSummaryQuery, TransactionSummaryDto>(
      new GetTransactionSummaryQuery(userId, queryDto.month, queryDto.year),
    );
  }

  async update(id: string, dto: UpdateTransactionDto, userId: string): Promise<TransactionDto> {
    const transaction = await this.commandBus.execute<UpdateTransactionCommand, Transaction>(
      new UpdateTransactionCommand(id, userId, {
        amount: dto.amount,
        type: dto.type,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : undefined,
        categoryId: dto.categoryId,
      }),
    );
    return this.toTransactionDto(transaction);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.commandBus.execute<DeleteTransactionCommand, void>(
      new DeleteTransactionCommand(id, userId),
    );
  }

  private toTransactionDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id,
      amount: Number(transaction.amount.toString()),
      type: transaction.type as TransactionDto['type'],
      description: transaction.description,
      date: transaction.date.toISOString(),
      categoryId: transaction.categoryId,
      userId: transaction.userId,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
