import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class FollowUserInput {
  @Field(() => Number)
  targetUserId: number;
}

@ObjectType()
export class FollowUserOutput extends BaseOutput {}
