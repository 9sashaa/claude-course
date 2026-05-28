'use client';

import { useCategories } from '@/src/features/categories';
import {
  CreateTransactionDialog,
  MonthSummary,
  TransactionList,
} from '@/src/features/transactions';

export default function DashboardPage() {
  const { data: categories = [] } = useCategories();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <MonthSummary />
      <div className="flex items-center justify-end">
        <CreateTransactionDialog categories={categories} />
      </div>
      <TransactionList categories={categories} />
    </div>
  );
}
