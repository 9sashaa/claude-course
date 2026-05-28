import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryCommand } from '../create-category.command';
import { CategoryRepository } from '../../category.repository';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    try {
      return await this.categoryRepository.create({
        name: command.name,
        color: command.color,
        icon: command.icon,
        userId: command.userId,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }
}
