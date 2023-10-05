import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import {
  ToggleLikeToGymInput,
  ToggleLikeToGymOutput,
} from './dto/toggle-like-to-gym.dto';
import { User } from 'src/user/entities/user.entity';
import {
  ToggleLikeToFeedInput,
  ToggleLikeToFeedOutput,
} from './dto/toggle-like-to-feed-dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => ToggleLikeToFeedOutput)
  async toggleLikeToFeed(
    @Args('input') toggleLikeToFeedInput: ToggleLikeToFeedInput,
    @CurrentUser() user: User,
  ): Promise<ToggleLikeToFeedOutput> {
    return this.likeService.toggleLikeToFeed(toggleLikeToFeedInput, user);
  }

  @Mutation(() => ToggleLikeToGymOutput)
  async toggleLikeToGym(
    @Args('input') toggleLikeToGymInput: ToggleLikeToGymInput,
    @CurrentUser() user: User,
  ): Promise<ToggleLikeToGymOutput> {
    return this.likeService.toggleLikeToGym(toggleLikeToGymInput, user);
  }
}
