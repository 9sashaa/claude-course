import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTransactionCommand } from '../delete-transaction.command';
import { TransactionRepository } from '../../transaction.repository';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler implements ICommandHandler<DeleteTransactionCommand> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(command: DeleteTransactionCommand): Promise<void> {
    const deleted = await this.transactionRepository.deleteByIdAndUser(command.id, command.userId);
    if (!deleted) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
