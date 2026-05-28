import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { CreateTransactionCommand } from '../create-transaction.command';
import { TransactionRepository } from '../../transaction.repository';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const categoryOwned = await this.transactionRepository.categoryBelongsToUser(
      command.categoryId,
      command.userId,
    );
    if (!categoryOwned) {
      throw new BadRequestException('Category not found');
    }

    return this.transactionRepository.create({
      amount: command.amount,
      type: command.type,
      description: command.description,
      date: command.date,
      categoryId: command.categoryId,
      userId: command.userId,
    });
  }
}
