import { Injectable } from '@nestjs/common';
import { Prisma, Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    amount: number;
    type: TransactionType;
    description?: string;
    date: Date;
    categoryId: string;
    userId: string;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  async findManyByUser(
    userId: string,
    filters: {
      dateFrom?: Date;
      dateTo?: Date;
      type?: TransactionType;
      categoryId?: string;
    },
  ): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = { userId };
    if (filters.type) where.type = filters.type;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }
    return this.prisma.transaction.findMany({ where, orderBy: { date: 'desc' } });
  }

  async findByIdAndUser(id: string, userId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({ where: { id, userId } });
  }

  async updateByIdAndUser(
    id: string,
    userId: string,
    data: {
      amount?: number;
      type?: TransactionType;
      description?: string | null;
      date?: Date;
      categoryId?: string;
    },
  ): Promise<Transaction | null> {
    const existing = await this.findByIdAndUser(id, userId);
    if (!existing) return null;
    return this.prisma.transaction.update({ where: { id }, data });
  }

  async deleteByIdAndUser(id: string, userId: string): Promise<boolean> {
    const existing = await this.findByIdAndUser(id, userId);
    if (!existing) return false;
    await this.prisma.transaction.delete({ where: { id } });
    return true;
  }

  async aggregateMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<Array<{ type: TransactionType; categoryId: string; total: Prisma.Decimal }>> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const groups = await this.prisma.transaction.groupBy({
      by: ['type', 'categoryId'],
      where: { userId, date: { gte: startDate, lt: endDate } },
      _sum: { amount: true },
    });

    return groups.map((g) => ({
      type: g.type,
      categoryId: g.categoryId,
      total: g._sum.amount ?? new Prisma.Decimal(0),
    }));
  }

  async categoryBelongsToUser(categoryId: string, userId: string): Promise<boolean> {
    const category = await this.prisma.category.findFirst({ where: { id: categoryId, userId } });
    return category !== null;
  }
}
