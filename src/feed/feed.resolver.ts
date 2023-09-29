import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FeedService } from './feed.service';
import { CreateFeedInput, CreateFeedOutput } from './dto/create-feed.dto';
import { User } from 'src/user/entities/user.entity';
import { GetAllFeedInput, GetAllFeedOutput } from './dto/get-all-feed.dto';
import { GetFeedByIdInput, GetFeedByIdOutput } from './dto/get-feed-by-id.dto';
import {
  EditFeedByUserInput,
  EditFeedByUserOutput,
} from './dto/edit-feed-by-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  DeleteFeedByUserInput,
  DeleteFeedByUserOutput,
} from './dto/delete-feed-by-user.dto';

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

  @Mutation(() => EditFeedByUserOutput)
  async editFeedByUser(
    @Args('input') editFeedByUserInput: EditFeedByUserInput,
    @CurrentUser() user: User,
  ): Promise<EditFeedByUserOutput> {
    return this.feedService.editFeedByUser(editFeedByUserInput, user);
  }

  @Mutation(() => DeleteFeedByUserOutput)
  async deleteFeedByUser(
    @Args('input') deleteFeedByUserInput: DeleteFeedByUserInput,
    @CurrentUser() user: User,
  ): Promise<DeleteFeedByUserOutput> {
    return this.feedService.deleteFeedByUser(deleteFeedByUserInput, user);
  }
}
