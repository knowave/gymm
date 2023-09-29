import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FeedService } from './feed.service';
import { CreateFeedInput, CreateFeedOutput } from './dto/create-feed.dto';
import { User } from 'src/user/entities/user.entity';
import { GetAllFeedInput, GetAllFeedOutput } from './dto/get-all-feed.dto';
import { GetFeedByIdInput, GetFeedByIdOutput } from './dto/get-feed-by-id.dto';

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

  @Query(() => GetAllFeedOutput)
  async getAllFeed(
    @Args('input') getAllFeedInput: GetAllFeedInput,
  ): Promise<GetAllFeedOutput> {
    return this.feedService.getAllFeed(getAllFeedInput);
  }

  @Query(() => GetFeedByIdOutput)
  async getFeedById(
    @Args('input') getFeedInput: GetFeedByIdInput,
  ): Promise<GetFeedByIdOutput> {
    return this.feedService.getFeedById(getFeedInput);
  }
}
