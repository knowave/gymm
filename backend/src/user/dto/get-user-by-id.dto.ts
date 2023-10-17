import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class GetUserByIdInput {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class GetUserByIdOutput extends BaseOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
