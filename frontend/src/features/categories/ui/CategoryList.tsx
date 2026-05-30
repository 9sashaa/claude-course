'use client';

import { Trash2Icon } from 'lucide-react';
import type { CategoryDto } from '@/src/entities/category';
import { Skeleton } from '@/src/shared/ui/skeleton';
import { useDeleteCategory } from '../model/useDeleteCategory';

interface Props {
  categories: CategoryDto[];
  isLoading: boolean;
}

export function CategoryList({ categories, isLoading }: Props) {
  const deleteMutation = useDeleteCategory();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center"
        style={{ boxShadow: '0 4px 24px rgba(108,78,232,0.07)' }}
      >
        <div
          className="mb-4 flex size-14 items-center justify-center rounded-2xl text-2xl"
          style={{ background: 'var(--violet-gradient)' }}
        >
          🏷️
        </div>
        <p className="text-base font-semibold text-slate-700">Нет категорий</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Создайте первую категорию для учёта расходов
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isDeleting={deleteMutation.isPending && deleteMutation.variables === category.id}
          onDelete={() => deleteMutation.mutate(category.id)}
        />
      ))}
    </div>
  );
}

function CategoryCard({
  category,
  isDeleting,
  onDelete,
}: {
  category: CategoryDto;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  return (
    <div
      className="group flex items-center gap-4 rounded-2xl bg-white p-4 transition-all"
      style={{ boxShadow: '0 4px 20px rgba(108,78,232,0.08)' }}
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{
          background: `linear-gradient(135deg, ${category.color}ee 0%, ${category.color}99 100%)`,
        }}
      >
        {category.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{category.name}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className="inline-block size-3 rounded-full"
            style={{ background: category.color }}
          />
          <span className="text-xs text-muted-foreground">{category.color}</span>
        </div>
      </div>

      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
        title="Удалить категорию"
      >
        <Trash2Icon className="size-4" />
      </button>
    </div>
  );
}
