import type { AuthResponseDto, LoginInput, RegisterInput } from '@expense-tracker/shared';
import { apiClient } from '@/src/shared/api/apiClient';

export const authApi = {
  login: (data: LoginInput) =>
    apiClient.post<AuthResponseDto>('/auth/login', data),

  register: (data: RegisterInput) =>
    apiClient.post<AuthResponseDto>('/auth/register', data),
};
