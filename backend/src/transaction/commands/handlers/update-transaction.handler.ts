import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { UpdateTransactionCommand } from '../update-transaction.command';
import { TransactionRepository } from '../../transaction.repository';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(command: UpdateTransactionCommand): Promise<Transaction> {
    if (command.data.categoryId) {
      const categoryOwned = await this.transactionRepository.categoryBelongsToUser(
        command.data.categoryId,
        command.userId,
      );
      if (!categoryOwned) {
        throw new BadRequestException('Category not found');
      }
    }

    const transaction = await this.transactionRepository.updateByIdAndUser(
      command.id,
      command.userId,
      command.data,
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
