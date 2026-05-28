'use client';

import Link from 'next/link';
import { WalletIcon } from 'lucide-react';
import { ROUTES } from '@/src/shared/config/routes';
import { UserProfileMenu } from '@/src/features/user-profile';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <Link
        href={ROUTES.DASHBOARD}
        className="flex items-center gap-2 font-semibold"
      >
        <WalletIcon className="size-5 text-primary" />
        <span>Expense Tracker</span>
      </Link>
      <UserProfileMenu />
    </header>
  );
}
