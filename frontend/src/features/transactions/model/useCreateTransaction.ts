'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/features/auth';
import type { CreateTransactionInput } from '@/src/entities/transaction';
import { transactionsApi } from '../api/transactionsApi';

export function useCreateTransaction() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      transactionsApi.create(input, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['transaction-summary'] });
    },
  });
}
