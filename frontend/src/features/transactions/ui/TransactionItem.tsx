'use client';

import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import type { TransactionDto } from '@/src/entities/transaction';
import type { CategoryDto } from '@/src/entities/category';
import { Badge } from '@/src/shared/ui/badge';
import { cn } from '@/src/shared/lib/utils';
import { formatCurrency } from '@/src/shared/lib/formatCurrency';

interface Props {
  transaction: TransactionDto;
  category?: CategoryDto;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function TransactionItem({ transaction, category }: Props) {
  const isIncome = transaction.type === 'INCOME';
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full',
            isIncome
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700',
          )}
          style={category ? { backgroundColor: `${category.color}33` } : undefined}
        >
          {isIncome ? <ArrowUpIcon className="size-4" /> : <ArrowDownIcon className="size-4" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {transaction.description ?? category?.name ?? 'Без описания'}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(transaction.date)}</span>
            {category && (
              <Badge variant="outline" className="px-1.5 py-0">
                {category.icon} {category.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'shrink-0 text-sm font-semibold tabular-nums',
          isIncome ? 'text-emerald-600' : 'text-rose-600',
        )}
      >
        {isIncome ? '+' : '−'}
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}
