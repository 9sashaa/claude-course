'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/features/auth';
import { categoriesApi } from '../api/categoriesApi';

export function useDeleteCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('Сессия истекла, войдите снова');
      return categoriesApi.delete(id, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
