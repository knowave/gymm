import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FeedService } from './feed.service';
import { CreateFeedInput, CreateFeedOutput } from './dto/create-feed.dto';
import { User } from 'src/user/entities/user.entity';

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Mutation(() => CreateFeedOutput)
  async createFeed(
    @Args('input') user: User,
    createFeedInput: CreateFeedInput,
  ): Promise<CreateFeedOutput> {
    return this.feedService.createFeed(user, createFeedInput);
  }
}
