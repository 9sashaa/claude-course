import type { Metadata } from 'next';
import { AuthProvider } from '@/src/features/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
