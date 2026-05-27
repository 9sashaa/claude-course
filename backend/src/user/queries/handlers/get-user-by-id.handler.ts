import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { GetUserByIdQuery } from '../get-user-by-id.query';
import { UserService } from '../../user.service';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    return this.userService.findById(query.id);
  }
}
