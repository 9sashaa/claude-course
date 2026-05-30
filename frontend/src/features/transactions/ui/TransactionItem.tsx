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

  const iconBg = isIncome
    ? 'var(--green-gradient)'
    : category?.color
      ? `linear-gradient(135deg, ${category.color}dd 0%, ${category.color}88 100%)`
      : 'var(--pink-gradient)';

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4"
      style={{ boxShadow: '0 2px 12px 0 rgba(108, 78, 232, 0.07)' }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: iconBg }}
        >
          {isIncome
            ? <ArrowUpIcon className="size-4 text-white" />
            : <ArrowDownIcon className="size-4 text-white" />
          }
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {transaction.description ?? category?.name ?? 'Без описания'}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(transaction.date)}
            </span>
            {category && (
              <Badge
                variant="outline"
                className="border-slate-200 px-1.5 py-0 text-xs text-slate-500"
              >
                {category.icon} {category.name}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'shrink-0 text-base font-bold tabular-nums',
          isIncome ? 'text-emerald-600' : 'text-rose-500',
        )}
      >
        {isIncome ? '+' : '−'}
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}
