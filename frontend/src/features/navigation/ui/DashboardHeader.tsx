'use client';

import Link from 'next/link';
import { MenuIcon, SearchIcon, WalletIcon } from 'lucide-react';
import { ROUTES } from '@/src/shared/config/routes';

interface Props {
  profileMenu?: React.ReactNode;
  onMobileMenuOpen: () => void;
}

export function DashboardHeader({ profileMenu, onMobileMenuOpen }: Props) {
  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 md:px-6"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 1px 16px 0 rgba(108, 78, 232, 0.07)',
      }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onMobileMenuOpen}
          className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-600 md:hidden"
          aria-label="Открыть меню"
        >
          <MenuIcon className="size-5" />
        </button>

        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-2.5 font-bold text-lg shrink-0"
          style={{ color: 'oklch(0.18 0.04 285)' }}
        >
          <div
            className="flex size-8 items-center justify-center rounded-xl"
            style={{ background: 'var(--violet-gradient)' }}
          >
            <WalletIcon className="size-4 text-white" />
          </div>
          <span className="hidden sm:inline">Расходы</span>
        </Link>
      </div>

      <div className="mx-6 hidden max-w-sm flex-1 md:flex">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск транзакций..."
            className="w-full rounded-2xl border-0 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            style={{ background: 'oklch(0.96 0.012 285)' }}
          />
        </div>
      </div>

      <div className="flex items-center">{profileMenu}</div>
    </header>
  );
}
