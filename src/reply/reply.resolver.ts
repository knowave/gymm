import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReplyService } from './reply.service';
import { Reply } from './entities/reply.entity';
import {
  WriteReplyByFeedInput,
  WriteReplyByFeedOutput,
} from './dto/write-reply-by-feed.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  WriteReplyByGymInput,
  WriteReplyByGymOutput,
} from './dto/write-reply-by-gym.dto';

@Resolver(() => Reply)
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}

  @Mutation(() => WriteReplyByFeedOutput)
  async writeReplyByFeed(
    @Args('input') writeReplyByFeedInput: WriteReplyByFeedInput,
    @CurrentUser() user: User,
  ): Promise<WriteReplyByFeedOutput> {
    return this.replyService.writeReplyByFeed(writeReplyByFeedInput, user);
  }

  @Mutation(() => WriteReplyByGymOutput)
  async wirteReplyByGym(
    @Args('input') writeReplyByGymInput: WriteReplyByGymInput,
    @CurrentUser() user: User,
  ): Promise<WriteReplyByGymOutput> {
    return this.replyService.writeReplyByGym(writeReplyByGymInput, user);
  }
}
