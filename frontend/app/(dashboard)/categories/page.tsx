'use client';

import { CategoryList, CreateCategoryDialog, useCategories } from '@/src/features/categories';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Категории</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isLoading ? '…' : `${categories.length} категор${categories.length === 1 ? 'ия' : categories.length < 5 ? 'ии' : 'ий'}`}
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      <CategoryList categories={categories} isLoading={isLoading} />
    </div>
  );
}
