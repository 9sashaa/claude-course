'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/features/auth';
import { categoriesApi } from '../api/categoriesApi';

export function useCategories() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(token!),
    enabled: !!token,
  });
}
