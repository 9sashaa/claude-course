'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboardIcon, ListIcon, TagIcon, WalletIcon } from 'lucide-react';
import { ROUTES } from '@/src/shared/config/routes';
import { cn } from '@/src/shared/lib/utils';

const NAV = [
  { label: 'Главная', href: ROUTES.DASHBOARD, icon: LayoutDashboardIcon },
  { label: 'Транзакции', href: ROUTES.TRANSACTIONS, icon: ListIcon },
  { label: 'Категории', href: ROUTES.CATEGORIES, icon: TagIcon },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="group hidden w-16 shrink-0 flex-col items-center py-5 transition-all duration-300 ease-in-out hover:w-52 md:flex"
      style={{
        background: 'var(--sidebar-bg)',
        boxShadow: '2px 0 16px 0 rgba(108, 78, 232, 0.07)',
      }}
    >
      <div className="flex w-full items-center px-3 mb-6">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--violet-gradient)' }}
        >
          <WalletIcon className="size-5 text-white" />
        </div>
        <span className="ml-3 overflow-hidden whitespace-nowrap text-sm font-bold text-slate-800 opacity-0 transition-all duration-200 group-hover:opacity-100 [width:0px] group-hover:[width:auto]">
          Расходы
        </span>
      </div>

      <nav className="flex w-full flex-1 flex-col gap-1.5 px-3">
        {NAV.map((item) => {
          const active =
            item.href === ROUTES.DASHBOARD
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'flex h-10 w-full items-center rounded-xl transition-all duration-200',
                active
                  ? 'text-white'
                  : 'text-slate-400 hover:bg-violet-50 hover:text-violet-600',
              )}
              style={
                active
                  ? {
                      background: 'var(--violet-gradient)',
                      boxShadow: '0 4px 12px rgba(108, 78, 232, 0.35)',
                    }
                  : undefined
              }
            >
              <span className="flex size-10 shrink-0 items-center justify-center">
                <Icon className="size-5" />
              </span>
              <span className="overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-200 group-hover:opacity-100 [width:0px] group-hover:[width:auto]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
