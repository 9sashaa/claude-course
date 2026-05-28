'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth';
import { DashboardLayout } from '@/src/features/navigation';
import { ROUTES } from '@/src/shared/config/routes';

export default function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated) return null;
  return <DashboardLayout>{children}</DashboardLayout>;
}
