'use client';

import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Skeleton } from '@/src/shared/ui/skeleton';
import { cn } from '@/src/shared/lib/utils';
import { useTransactionSummary } from '../model/useTransactionSummary';

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(amount);
}

const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export function MonthSummary() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const { data, isLoading } = useTransactionSummary(month, year);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">
        Сводка за {MONTH_NAMES[month - 1]} {year}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Доходы"
          amount={data?.totalIncome ?? 0}
          isLoading={isLoading}
          icon={<ArrowUpIcon className="size-4 text-emerald-600" />}
          valueClass="text-emerald-600"
        />
        <SummaryCard
          label="Расходы"
          amount={data?.totalExpense ?? 0}
          isLoading={isLoading}
          icon={<ArrowDownIcon className="size-4 text-rose-600" />}
          valueClass="text-rose-600"
        />
        <SummaryCard
          label="Баланс"
          amount={data?.net ?? 0}
          isLoading={isLoading}
          icon={<WalletIcon className="size-4" />}
          valueClass={cn(
            (data?.net ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600',
          )}
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
}: {
  label: string;
  amount: number;
  icon: React.ReactNode;
  isLoading: boolean;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-32" />
        ) : (
          <p className={cn('text-2xl font-semibold tabular-nums', valueClass)}>
            {formatAmount(amount)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
