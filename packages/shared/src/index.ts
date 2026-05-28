// Types and contracts shared between the web and api apps.

export interface CategoryDto {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionDto {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: string;
  userId: string;
  createdAt: string;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
  categoryId: string;
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: TransactionType;
  description?: string | null;
  date?: string;
  categoryId?: string;
}

export interface TransactionListQuery {
  dateFrom?: string;
  dateTo?: string;
  type?: TransactionType;
  categoryId?: string;
}

export interface TransactionSummaryDto {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
  byCategory: Array<{
    categoryId: string;
    type: TransactionType;
    total: number;
  }>;
}
