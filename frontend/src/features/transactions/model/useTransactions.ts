'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/features/auth';
import type { TransactionListQuery } from '@/src/entities/transaction';
import { transactionsApi } from '../api/transactionsApi';

export const TRANSACTIONS_PAGE_SIZE = 10;

export function useTransactions(filters: TransactionListQuery, page: number) {
  const { token } = useAuth();
  const query = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.list(filters, token!),
    enabled: !!token,
  });

  const all = useMemo(() => query.data ?? [], [query.data]);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / TRANSACTIONS_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const items = all.slice(
    (safePage - 1) * TRANSACTIONS_PAGE_SIZE,
    safePage * TRANSACTIONS_PAGE_SIZE,
  );

  return {
    items,
    total,
    totalPages,
    page: safePage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
