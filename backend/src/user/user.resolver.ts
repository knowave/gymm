import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { GetUserByIdInput, GetUserByIdOutput } from './dto/get-user-by-id.dto';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { DeleteUserInput, DeleteUserOutput } from './dto/delete-user.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => GetUserByIdOutput)
  async getUserById(
    @Args('input') getUserByIdInput: GetUserByIdInput,
  ): Promise<GetUserByIdOutput> {
    return this.userService.getUserById(getUserByIdInput);
  }

  @Mutation(() => EditUserOutput)
  async updateUser(@Args('input') editUserInput: EditUserInput) {
    return this.userService.editUser(editUserInput);
  }

  @Mutation(() => DeleteUserOutput)
  async removeUser(@Args('input') deleteUserInput: DeleteUserInput) {
    return this.userService.deleteUser(deleteUserInput);
  }
}
