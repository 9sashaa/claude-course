'use client';

import { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { Skeleton } from '@/src/shared/ui/skeleton';
import type { CategoryDto } from '@/src/entities/category';
import type { TransactionListQuery } from '@/src/entities/transaction';
import { useTransactions } from '../model/useTransactions';
import { TransactionItem } from './TransactionItem';
import { TransactionFilters } from './TransactionFilters';

interface Props {
  categories: CategoryDto[];
}

export function TransactionList({ categories }: Props) {
  const [filters, setFilters] = useState<TransactionListQuery>({});
  const [page, setPage] = useState(1);
  const { items, total, totalPages, isLoading, isError } = useTransactions(
    filters,
    page,
  );

  const categoryById = useMemo(() => {
    const map = new Map<string, CategoryDto>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const handleFiltersChange = (next: TransactionListQuery) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <TransactionFilters
        value={filters}
        onChange={handleFiltersChange}
        categories={categories}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Не удалось загрузить транзакции</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Транзакций пока нет
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              category={categoryById.get(t.categoryId)}
            />
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="flex items-center justify-between pt-2 text-sm">
          <span className="text-muted-foreground">
            Стр. {page} из {totalPages} • всего {total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeftIcon className="size-4" />
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Вперёд
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
