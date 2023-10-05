import { Resolver } from '@nestjs/graphql';
import { ReplyService } from './reply.service';
import { Reply } from './entities/reply.entity';

@Resolver(() => Reply)
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}
}
