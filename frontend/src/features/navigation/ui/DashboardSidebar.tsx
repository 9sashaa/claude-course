'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboardIcon, ListIcon, TagIcon } from 'lucide-react';
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
    <aside className="hidden w-56 shrink-0 border-r bg-card/30 p-4 md:block">
      <nav className="flex flex-col gap-1">
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
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
