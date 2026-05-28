import { apiClient } from '@/src/shared/api/apiClient';
import type {
  TransactionDto,
  TransactionListQuery,
  TransactionSummaryDto,
  CreateTransactionInput,
} from '@/src/entities/transaction';

export const transactionsApi = {
  list: (filters: TransactionListQuery, token: string) =>
    apiClient.get<TransactionDto[]>('/transactions', {
      query: { ...filters },
      token,
    }),
  summary: (month: number, year: number, token: string) =>
    apiClient.get<TransactionSummaryDto>('/transactions/summary', {
      query: { month, year },
      token,
    }),
  create: (input: CreateTransactionInput, token: string) =>
    apiClient.post<TransactionDto>('/transactions', input, { token }),
};
