'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XIcon, WalletIcon, LayoutDashboardIcon, ListIcon, TagIcon } from 'lucide-react';
import { ROUTES } from '@/src/shared/config/routes';
import { cn } from '@/src/shared/lib/utils';

const NAV = [
  { label: 'Главная', href: ROUTES.DASHBOARD, icon: LayoutDashboardIcon },
  { label: 'Транзакции', href: ROUTES.TRANSACTIONS, icon: ListIcon },
  { label: 'Категории', href: ROUTES.CATEGORIES, icon: TagIcon },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-white py-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--violet-gradient)' }}
            >
              <WalletIcon className="size-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-800">Расходы</span>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Закрыть меню"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3">
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
                  'flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all',
                  active
                    ? 'text-white'
                    : 'text-slate-500 hover:bg-violet-50 hover:text-violet-600',
                )}
                style={
                  active
                    ? {
                        background: 'var(--violet-gradient)',
                        boxShadow: '0 4px 12px rgba(108, 78, 232, 0.3)',
                      }
                    : undefined
                }
              >
                <Icon className="size-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
