'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import { Checkbox } from '@/src/shared/ui/checkbox';
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

const registerSchema = z.object({
  name: z.string().min(1, 'Введите имя'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Необходимо принять условия',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', terms: false },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      const data = await authApi.register({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      login(data);
      router.push(ROUTES.HOME);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Ошибка регистрации');
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
          <span className="text-xl">✨</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Регистрация</CardTitle>
        <CardDescription>Создайте новый аккаунт</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Имя</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Иван Иванов"
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
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-start gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 shrink-0"
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="block font-normal text-sm leading-snug cursor-pointer">
                      Согласен с{' '}
                      <Link
                        href="/terms"
                        className="text-primary underline underline-offset-4 hover:no-underline"
                      >
                        пользовательским соглашением
                      </Link>{' '}
                      и{' '}
                      <Link
                        href="/privacy"
                        className="text-primary underline underline-offset-4 hover:no-underline"
                      >
                        политикой обработки данных
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
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
              {form.formState.isSubmitting ? 'Регистрируемся...' : 'Зарегистрироваться'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold hover:underline"
            style={{ color: 'oklch(0.54 0.22 285)' }}
          >
            Войти
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
