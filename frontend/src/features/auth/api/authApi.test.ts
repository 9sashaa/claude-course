import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './authApi';
import { apiClient } from '@/src/shared/api/apiClient';

vi.mock('@/src/shared/api/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockPost = vi.mocked(apiClient.post);

beforeEach(() => {
  mockPost.mockReset();
});

describe('authApi.login', () => {
  it('calls apiClient.post with /auth/login and credentials', async () => {
    const credentials = { email: 'user@example.com', password: 'secret' };
    const response = { accessToken: 'token-123', user: { id: 1, email: 'user@example.com' } };
    mockPost.mockResolvedValue(response);

    const result = await authApi.login(credentials);

    expect(mockPost).toHaveBeenCalledOnce();
    expect(mockPost).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual(response);
  });

  it('propagates error when apiClient.post rejects', async () => {
    mockPost.mockRejectedValue(new Error('Invalid credentials'));

    await expect(authApi.login({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow(
      'Invalid credentials',
    );
  });
});

describe('authApi.register', () => {
  it('calls apiClient.post with /auth/register and user data', async () => {
    const payload = { email: 'new@example.com', password: 'pass123', name: 'Alice' };
    const response = { accessToken: 'token-456', user: { id: 2, email: 'new@example.com' } };
    mockPost.mockResolvedValue(response);

    const result = await authApi.register(payload);

    expect(mockPost).toHaveBeenCalledOnce();
    expect(mockPost).toHaveBeenCalledWith('/auth/register', payload);
    expect(result).toEqual(response);
  });

  it('propagates error when apiClient.post rejects', async () => {
    mockPost.mockRejectedValue(new Error('Email already taken'));

    await expect(
      authApi.register({ email: 'taken@example.com', password: 'pass', name: 'Bob' }),
    ).rejects.toThrow('Email already taken');
  });
});
