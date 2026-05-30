'use client';

import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from 'lucide-react';
import { Skeleton } from '@/src/shared/ui/skeleton';
import { cn } from '@/src/shared/lib/utils';
import { formatCurrency } from '@/src/shared/lib/formatCurrency';
import { useTransactionSummary } from '../model/useTransactionSummary';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export function MonthSummary() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();
    const id = setTimeout(() => setNow(new Date()), msUntilMidnight);
    return () => clearTimeout(id);
  }, [now]);

  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const { data, isLoading } = useTransactionSummary(month, year);

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Сводка · {MONTH_NAMES[month - 1]} {year}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Доходы"
          amount={data?.totalIncome ?? 0}
          isLoading={isLoading}
          icon={<ArrowUpIcon className="size-4 text-white" />}
          iconBg="var(--green-gradient)"
          valueClass="text-emerald-600"
        />
        <SummaryCard
          label="Расходы"
          amount={data?.totalExpense ?? 0}
          isLoading={isLoading}
          icon={<ArrowDownIcon className="size-4 text-white" />}
          iconBg="var(--pink-gradient)"
          valueClass="text-rose-500"
        />
        <SummaryCard
          label="Баланс"
          amount={data?.net ?? 0}
          isLoading={isLoading}
          icon={<WalletIcon className="size-4 text-white" />}
          iconBg="var(--violet-gradient)"
          valueClass={cn((data?.net ?? 0) >= 0 ? 'text-violet-600' : 'text-rose-500')}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  amount,
  icon,
  isLoading,
  valueClass,
  iconBg,
}: {
  label: string;
  amount: number;
  icon: React.ReactNode;
  isLoading: boolean;
  valueClass?: string;
  iconBg: string;
}) {
  return (
    <div
      className="rounded-2xl bg-white p-5"
      style={{ boxShadow: '0 4px 24px 0 rgba(108, 78, 232, 0.09)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div
          className="flex size-9 items-center justify-center rounded-xl"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-9 w-32" />
      ) : (
        <p className={cn('text-3xl font-bold tabular-nums tracking-tight', valueClass)}>
          {formatCurrency(amount)}
        </p>
      )}
    </div>
  );
}
