'use client';

import { useCategories } from '@/src/features/categories';
import {
  CreateTransactionDialog,
  MonthSummary,
  TransactionList,
} from '@/src/features/transactions';

export default function TransactionsPage() {
  const { data: categories = [] } = useCategories();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Транзакции</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">История доходов и расходов</p>
        </div>
        <CreateTransactionDialog categories={categories} />
      </div>

      <MonthSummary />

      <TransactionList categories={categories} />
    </div>
  );
}
