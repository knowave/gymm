import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GymService } from './gym.service';
import {
  CreateGymByTrainerInput,
  CreateGymByTrainerOutput,
} from './dto/create-gym-by-trainer.dto';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/auth/decorators/user-role.decorator';
import { GetAllGymInput, GetAllGymOutput } from './dto/get-all-gym.dto';
import { GetGymByIdInput, GetGymByIdOutput } from './dto/get-gym-by-id.dto';
import {
  EditGymByTrainerInput,
  EditGymByTrainerOutput,
} from './dto/edit-gym-by-trainer.dto';

@Resolver()
export class GymResolver {
  constructor(private readonly gymService: GymService) {}

  @Mutation(() => CreateGymByTrainerOutput)
  @Role(['TRAINER'])
  async createGymByTrainer(
    @Args('input') createTrainerByUserInput: CreateGymByTrainerInput,
    @CurrentUser() user: User,
  ): Promise<CreateGymByTrainerOutput> {
    return this.gymService.createGymByTrainer(createTrainerByUserInput, user);
  }

  @Query(() => GetAllGymOutput)
  @Role(['ANY'])
  async getAllGym(
    @Args('input') getAllGymInput: GetAllGymInput,
  ): Promise<GetAllGymOutput> {
    return this.gymService.getAllGym(getAllGymInput);
  }

  @Query(() => GetGymByIdOutput)
  @Role(['ANY'])
  async getGymById(
    @Args('input') getGymByIdInput: GetGymByIdInput,
  ): Promise<GetGymByIdOutput> {
    return this.gymService.getGymById(getGymByIdInput);
  }

  @Mutation(() => EditGymByTrainerOutput)
  @Role(['TRAINER'])
  async editGymByTrainer(
    @Args('input') editGymByTrainerInput: EditGymByTrainerInput,
    @CurrentUser() user: User,
  ): Promise<EditGymByTrainerOutput> {
    return this.gymService.editGymByTrainer(editGymByTrainerInput, user);
  }
}
