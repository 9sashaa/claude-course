'use client';

import { XIcon } from 'lucide-react';
import { Input } from '@/src/shared/ui/input';
import { Button } from '@/src/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui/select';
import { useCategories } from '@/src/features/categories';
import type {
  TransactionListQuery,
  TransactionType,
} from '@/src/entities/transaction';

const ALL = '__all__';

interface Props {
  value: TransactionListQuery;
  onChange: (next: TransactionListQuery) => void;
}

export function TransactionFilters({ value, onChange }: Props) {
  const { data: categories } = useCategories();
  const hasFilters =
    !!value.type || !!value.categoryId || !!value.dateFrom || !!value.dateTo;

  const update = (patch: Partial<TransactionListQuery>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={value.type ?? ALL}
        onValueChange={(v) =>
          update({ type: v === ALL ? undefined : (v as TransactionType) })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Тип" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Все типы</SelectItem>
          <SelectItem value="INCOME">Доход</SelectItem>
          <SelectItem value="EXPENSE">Расход</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={value.categoryId ?? ALL}
        onValueChange={(v) =>
          update({ categoryId: v === ALL ? undefined : v })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Категория" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Все категории</SelectItem>
          {(categories ?? []).map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.icon} {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        className="w-[160px]"
        value={value.dateFrom?.slice(0, 10) ?? ''}
        onChange={(e) =>
          update({
            dateFrom: e.target.value
              ? new Date(e.target.value).toISOString()
              : undefined,
          })
        }
      />
      <Input
        type="date"
        className="w-[160px]"
        value={value.dateTo?.slice(0, 10) ?? ''}
        onChange={(e) =>
          update({
            dateTo: e.target.value
              ? new Date(e.target.value).toISOString()
              : undefined,
          })
        }
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          <XIcon className="size-4" /> Сбросить
        </Button>
      )}
    </div>
  );
}
