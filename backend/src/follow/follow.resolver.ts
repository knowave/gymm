import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { FollowUserInput, FollowUserOutput } from './dto/follow-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  UnFollowUserInput,
  UnFollowUserOutput,
} from './dto/un-follow-user.dto';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => FollowUserOutput)
  async followUser(
    @Args('input') followUserInput: FollowUserInput,
    @CurrentUser() user: User,
  ): Promise<FollowUserOutput> {
    return this.followService.followUser(followUserInput, user);
  }

  @Mutation(() => UnFollowUserOutput)
  async unFollowUser(
    @Args('input') unFollowUserInput: UnFollowUserInput,
    @CurrentUser() user: User,
  ): Promise<UnFollowUserOutput> {
    return this.followService.followUser(unFollowUserInput, user);
  }
}
