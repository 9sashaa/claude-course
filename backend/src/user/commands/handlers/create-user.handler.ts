import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserCommand } from '../create-user.command';
import { UserService } from '../../user.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const existing = await this.userService.findByEmail(command.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    return this.userService.create({
      email: command.email,
      passwordHash: command.passwordHash,
      name: command.name,
    });
  }
}
