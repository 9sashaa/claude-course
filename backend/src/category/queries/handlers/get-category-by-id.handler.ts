import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { GetCategoryByIdQuery } from '../get-category-by-id.query';
import { CategoryRepository } from '../../category.repository';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoryByIdQuery): Promise<Category> {
    const category = await this.categoryRepository.findByIdAndUserId(query.id, query.userId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
