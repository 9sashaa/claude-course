'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/shared/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/ui/form';
import { authApi } from '../api/authApi';
import { useAuth } from '../model/authContext';
import { ROUTES } from '@/src/shared/config/routes';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const data = await authApi.login(values);
      login(data);
      router.push(ROUTES.HOME);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Ошибка входа');
    }
  };

  return (
    <Card
      className="w-full max-w-md border-0"
      style={{ boxShadow: '0 8px 40px 0 rgba(108, 78, 232, 0.14)' }}
    >
      <CardHeader className="pb-4">
        <div
          className="mb-4 flex size-12 items-center justify-center rounded-2xl"
          style={{ background: 'var(--violet-gradient)' }}
        >
          <span className="text-xl">💰</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Добро пожаловать</CardTitle>
        <CardDescription className="text-sm">Введите данные для входа в аккаунт</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <p className="text-destructive text-sm">{serverError}</p>
            )}
            <Button
              type="submit"
              className="mt-2 w-full rounded-xl border-0 font-semibold text-white"
              style={{ background: 'var(--violet-gradient)' }}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Входим...' : 'Войти'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Нет аккаунта?{' '}
          <Link
            href={ROUTES.REGISTER}
            className="font-semibold hover:underline"
            style={{ color: 'oklch(0.54 0.22 285)' }}
          >
            Зарегистрироваться
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
