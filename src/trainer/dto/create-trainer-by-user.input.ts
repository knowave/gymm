import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';
import { UserRole } from 'src/user/enums/user-role.enum';

@InputType()
export class CreateTrainerByUserInput {
  @Field(() => UserRole)
  role: UserRole;
}

@ObjectType()
export class CreateTrainerByUserOutput extends BaseOutput {}
