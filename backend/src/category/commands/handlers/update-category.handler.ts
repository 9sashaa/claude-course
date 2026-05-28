import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { UpdateCategoryCommand } from '../update-category.command';
import { CategoryRepository } from '../../category.repository';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    try {
      const updated = await this.categoryRepository.updateByIdAndUserId(
        command.id,
        command.userId,
        command.data,
      );
      if (!updated) {
        throw new NotFoundException('Category not found');
      }
      return updated;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }
}
