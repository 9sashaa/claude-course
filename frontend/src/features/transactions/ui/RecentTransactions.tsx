'use client';

import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { Skeleton } from '@/src/shared/ui/skeleton';
import type { CategoryDto } from '@/src/entities/category';
import { ROUTES } from '@/src/shared/config/routes';
import { useTransactions } from '../model/useTransactions';
import { TransactionItem } from './TransactionItem';

interface Props {
  categories: CategoryDto[];
}

export function RecentTransactions({ categories }: Props) {
  const { items, isLoading, isError } = useTransactions({}, 1);
  const recent = items.slice(0, 5);

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Последние транзакции</h2>
        <Link
          href={ROUTES.TRANSACTIONS}
          className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: 'oklch(0.54 0.22 285)' }}
        >
          Все транзакции
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Не удалось загрузить транзакции</p>
      ) : recent.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-12 text-center"
          style={{ boxShadow: '0 4px 24px rgba(108,78,232,0.07)' }}
        >
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-2xl text-xl"
            style={{ background: 'var(--violet-gradient)' }}
          >
            💸
          </div>
          <p className="text-sm font-semibold text-slate-700">Транзакций пока нет</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Перейдите в раздел «Транзакции», чтобы добавить первую запись
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              category={categoryById.get(t.categoryId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
