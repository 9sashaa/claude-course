// Types and contracts shared between the web and api apps.

export interface ExpenseDto {
  id: string;
  amount: number;
  currency: string;
  description: string | null;
  spentAt: string;
  categoryId: string | null;
  userId: string;
}

export interface CreateExpenseInput {
  amount: number;
  currency?: string;
  description?: string;
  spentAt?: string;
  categoryId?: string;
}

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
