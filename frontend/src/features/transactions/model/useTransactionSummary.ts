'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/features/auth';
import { transactionsApi } from '../api/transactionsApi';

export function useTransactionSummary(month: number, year: number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['transaction-summary', month, year],
    queryFn: () => transactionsApi.summary(month, year, token!),
    enabled: !!token,
  });
}
