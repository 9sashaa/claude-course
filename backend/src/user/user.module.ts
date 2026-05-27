import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { GetUserByEmailHandler } from './queries/handlers/get-user-by-email.handler';
import { GetUserByIdHandler } from './queries/handlers/get-user-by-id.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    UserRepository,
    UserService,
    CreateUserHandler,
    GetUserByEmailHandler,
    GetUserByIdHandler,
  ],
})
export class UserModule {}
