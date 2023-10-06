import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReplyService } from './reply.service';
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
import {
  EditReplyByFeedInput,
  EditReplyByFeedOutput,
} from './dto/edit-reply-by-feed.dto';
import {
  EditReplyByGymInput,
  EditReplyByGymOutput,
} from './dto/edit-reply-by-gym.dto';
import { DeleteReplyInput, DeleteReplyOutput } from './dto/delete-reply.dto';

@Resolver()
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

  @Mutation(() => EditReplyByFeedOutput)
  async editReplyByFeed(
    @Args('input') writeReplyByGymInput: EditReplyByFeedInput,
    @CurrentUser() user: User,
  ): Promise<EditReplyByFeedOutput> {
    return this.replyService.editReplyByFeed(writeReplyByGymInput, user);
  }

  @Mutation(() => EditReplyByGymOutput)
  async editReplyByGym(
    @Args('input') writeReplyByGymInput: EditReplyByGymInput,
    @CurrentUser() user: User,
  ): Promise<EditReplyByGymOutput> {
    return this.replyService.editReplyByGym(writeReplyByGymInput, user);
  }

  @Mutation(() => DeleteReplyOutput)
  async deleteReplyByFeed(
    @Args('input') deleteReplyInput: DeleteReplyInput,
    @CurrentUser() user: User,
  ): Promise<DeleteReplyOutput> {
    return this.replyService.deleteReplyByFeed(deleteReplyInput, user);
  }

  @Mutation(() => DeleteReplyOutput)
  async deleteReplyByGym(
    @Args('input') deleteReplyInput: DeleteReplyInput,
    @CurrentUser() user: User,
  ): Promise<DeleteReplyOutput> {
    return this.replyService.deleteReplyByGym(deleteReplyInput, user);
  }
}
