'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/features/auth';
import type { CreateCategoryInput } from '@/src/entities/category';
import { categoriesApi } from '../api/categoriesApi';

export function useCreateCategory() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => {
      if (!token) throw new Error('Сессия истекла, войдите снова');
      return categoriesApi.create(input, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
