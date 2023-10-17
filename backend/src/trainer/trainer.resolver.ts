import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TrainerService } from './trainer.service';
import {
  CreateTrainerByUserInput,
  CreateTrainerByUserOutput,
} from './dto/create-trainer-by-user.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver()
export class TrainerResolver {
  constructor(private readonly trainerService: TrainerService) {}

  @Mutation(() => CreateTrainerByUserOutput)
  async createTrainerByUser(
    @Args('input') createTrainerByUserInput: CreateTrainerByUserInput,
    @CurrentUser() user: User,
  ): Promise<CreateTrainerByUserOutput> {
    return this.trainerService.createTrainerByUser(
      createTrainerByUserInput,
      user,
    );
  }
}
