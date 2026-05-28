import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TransactionDto, TransactionSummaryDto } from '@expense-tracker/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions.query.dto';
import { TransactionSummaryQueryDto } from './dto/transaction-summary.query.dto';

interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TransactionDto> {
    return this.transactionService.create(dto, req.user.userId);
  }

  @Get()
  findAll(
    @Query() query: ListTransactionsQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TransactionDto[]> {
    return this.transactionService.findAll(req.user.userId, query);
  }

  @Get('summary')
  getSummary(
    @Query() query: TransactionSummaryQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TransactionSummaryDto> {
    return this.transactionService.getSummary(req.user.userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<TransactionDto> {
    return this.transactionService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TransactionDto> {
    return this.transactionService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<void> {
    return this.transactionService.remove(id, req.user.userId);
  }
}
