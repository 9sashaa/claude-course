import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; color: string; icon: string; userId: string }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findManyByUserId(userId: string): Promise<Category[]> {
    return this.prisma.category.findMany({ where: { userId } });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Category | null> {
    return this.prisma.category.findFirst({ where: { id, userId } });
  }

  async updateByIdAndUserId(
    id: string,
    userId: string,
    data: { name?: string; color?: string; icon?: string },
  ): Promise<Category | null> {
    const existing = await this.findByIdAndUserId(id, userId);
    if (!existing) return null;
    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteByIdAndUserId(id: string, userId: string): Promise<boolean> {
    const existing = await this.findByIdAndUserId(id, userId);
    if (!existing) return false;
    await this.prisma.category.delete({ where: { id } });
    return true;
  }
}
