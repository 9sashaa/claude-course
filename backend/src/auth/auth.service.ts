import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthResponseDto, UserDto } from '@expense-tracker/shared';
import { CreateUserCommand } from '../user/commands/create-user.command';
import { GetUserByEmailQuery } from '../user/queries/get-user-by-email.query';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.commandBus.execute<CreateUserCommand, User>(
      new CreateUserCommand(dto.email, passwordHash, dto.name),
    );
    return { accessToken: this.generateToken(user), user: this.toUserDto(user) };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.queryBus.execute<GetUserByEmailQuery, User | null>(
      new GetUserByEmailQuery(dto.email),
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return { accessToken: this.generateToken(user), user: this.toUserDto(user) };
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }

  private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
