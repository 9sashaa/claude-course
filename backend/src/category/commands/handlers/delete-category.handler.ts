import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { DeleteCategoryCommand } from '../delete-category.command';
import { CategoryRepository } from '../../category.repository';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const deleted = await this.categoryRepository.deleteByIdAndUserId(command.id, command.userId);
    if (!deleted) {
      throw new NotFoundException('Category not found');
    }
  }
}
