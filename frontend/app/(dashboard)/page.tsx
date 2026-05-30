'use client';

import { useCategories } from '@/src/features/categories';
import { MonthSummary, RecentTransactions } from '@/src/features/transactions';
import { useAuth } from '@/src/features/auth';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

const DATE_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: categories = [] } = useCategories();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          {getGreeting()}{user?.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="mt-0.5 text-sm capitalize text-muted-foreground">
          {DATE_FORMAT.format(new Date())}
        </p>
      </div>

      <MonthSummary />

      <RecentTransactions categories={categories} />
    </div>
  );
}
