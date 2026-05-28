import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Category } from '@prisma/client';
import { CategoryDto } from '@expense-tracker/shared';
import { CreateCategoryCommand } from './commands/create-category.command';
import { UpdateCategoryCommand } from './commands/update-category.command';
import { DeleteCategoryCommand } from './commands/delete-category.command';
import { GetCategoriesByUserQuery } from './queries/get-categories-by-user.query';
import { GetCategoryByIdQuery } from './queries/get-category-by-id.query';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: CreateCategoryDto, userId: string): Promise<CategoryDto> {
    const category = await this.commandBus.execute<CreateCategoryCommand, Category>(
      new CreateCategoryCommand(dto.name, dto.color, dto.icon, userId),
    );
    return this.toCategoryDto(category);
  }

  async findAll(userId: string): Promise<CategoryDto[]> {
    const categories = await this.queryBus.execute<GetCategoriesByUserQuery, Category[]>(
      new GetCategoriesByUserQuery(userId),
    );
    return categories.map(this.toCategoryDto);
  }

  async findOne(id: string, userId: string): Promise<CategoryDto> {
    const category = await this.queryBus.execute<GetCategoryByIdQuery, Category>(
      new GetCategoryByIdQuery(id, userId),
    );
    return this.toCategoryDto(category);
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string): Promise<CategoryDto> {
    const category = await this.commandBus.execute<UpdateCategoryCommand, Category>(
      new UpdateCategoryCommand(id, userId, dto),
    );
    return this.toCategoryDto(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.commandBus.execute<DeleteCategoryCommand, void>(
      new DeleteCategoryCommand(id, userId),
    );
  }

  private toCategoryDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      userId: category.userId,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
