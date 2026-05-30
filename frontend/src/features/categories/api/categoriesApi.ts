import { apiClient } from '@/src/shared/api/apiClient';
import type { CategoryDto, CreateCategoryInput } from '@/src/entities/category';

export const categoriesApi = {
  list: (token: string) =>
    apiClient.get<CategoryDto[]>('/categories', { token }),

  create: (input: CreateCategoryInput, token: string) =>
    apiClient.post<CategoryDto>('/categories', input, { token }),

  delete: (id: string, token: string) =>
    apiClient.delete<void>(`/categories/${id}`, { token }),
};
