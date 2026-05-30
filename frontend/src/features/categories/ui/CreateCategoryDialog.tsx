'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/src/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/ui/form';
import { useCreateCategory } from '../model/useCreateCategory';

const PRESET_ICONS = [
  '🏠', '🚗', '🍔', '☕', '🎮', '✈️', '💊', '🛒',
  '📚', '💪', '🎵', '👗', '💼', '🎁', '⚡', '💰',
];

const PRESET_COLORS = [
  '#6c4ee8', '#ff4d8b', '#10b981', '#f97316',
  '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6',
];

const schema = z.object({
  name: z.string().min(1, 'Введите название').max(32, 'Не более 32 символов'),
  icon: z.string().min(1, 'Выберите иконку'),
  color: z.string().min(1, 'Выберите цвет'),
});

type FormValues = z.infer<typeof schema>;

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', icon: '💰', color: '#6c4ee8' },
  });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values);
    form.reset({ name: '', icon: '💰', color: '#6c4ee8' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-xl border-0 font-semibold text-white"
          style={{ background: 'var(--violet-gradient)' }}
        >
          <PlusIcon className="size-4" />
          Добавить категорию
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl border-0 sm:max-w-md" style={{ boxShadow: '0 8px 40px rgba(108,78,232,0.18)' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Новая категория</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Например: Кафе и рестораны"
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Иконка</FormLabel>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {PRESET_ICONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => field.onChange(emoji)}
                          className="flex size-9 items-center justify-center rounded-xl text-lg transition-all"
                          style={{
                            background: field.value === emoji
                              ? 'var(--violet-gradient)'
                              : 'oklch(0.96 0.012 285)',
                            boxShadow: field.value === emoji
                              ? '0 2px 8px rgba(108,78,232,0.35)'
                              : undefined,
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Или введите эмодзи вручную"
                        className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-violet-400"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Цвет</FormLabel>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className="size-8 rounded-lg transition-all"
                          style={{
                            background: color,
                            outline: field.value === color ? `3px solid ${color}` : undefined,
                            outlineOffset: '2px',
                          }}
                        />
                      ))}
                    </div>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-1"
                        />
                        <span className="text-sm text-muted-foreground">{field.value}</span>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.isError && (
              <p className="text-sm text-destructive">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : 'Ошибка при создании'}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setOpen(false)}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="rounded-xl border-0 font-semibold text-white"
                style={{ background: 'var(--violet-gradient)' }}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Сохранение…' : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
