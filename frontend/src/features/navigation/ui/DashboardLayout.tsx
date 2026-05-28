'use client';

import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

interface Props {
  children: React.ReactNode;
  profileMenu?: React.ReactNode;
}

export function DashboardLayout({ children, profileMenu }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader profileMenu={profileMenu} />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
