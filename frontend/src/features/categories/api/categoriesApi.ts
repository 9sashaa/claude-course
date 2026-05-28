import { apiClient } from '@/src/shared/api/apiClient';
import type { CategoryDto } from '@/src/entities/category';

export const categoriesApi = {
  list: (token: string) =>
    apiClient.get<CategoryDto[]>('/categories', { token }),
};
