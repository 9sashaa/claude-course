'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/features/auth';
import { DashboardLayout } from '@/src/features/navigation';
import { UserProfileMenu } from '@/src/features/user-profile';
import { Skeleton } from '@/src/shared/ui/skeleton';
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

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout profileMenu={<UserProfileMenu />}>
      {children}
    </DashboardLayout>
  );
}
