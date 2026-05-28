'use client';

import {
  CreateTransactionDialog,
  MonthSummary,
  TransactionList,
} from '@/src/features/transactions';

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <MonthSummary />
      <div className="flex items-center justify-end">
        <CreateTransactionDialog />
      </div>
      <TransactionList />
    </div>
  );
}
