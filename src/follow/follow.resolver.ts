import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { FollowUserInput, FollowUserOutput } from './dto/follow-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

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
}
