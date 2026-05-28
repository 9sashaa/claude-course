import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CreateCategoryHandler } from './commands/handlers/create-category.handler';
import { UpdateCategoryHandler } from './commands/handlers/update-category.handler';
import { DeleteCategoryHandler } from './commands/handlers/delete-category.handler';
import { GetCategoriesByUserHandler } from './queries/handlers/get-categories-by-user.handler';
import { GetCategoryByIdHandler } from './queries/handlers/get-category-by-id.handler';

@Module({
  imports: [CqrsModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    DeleteCategoryHandler,
    GetCategoriesByUserHandler,
    GetCategoryByIdHandler,
  ],
})
export class CategoryModule {}
