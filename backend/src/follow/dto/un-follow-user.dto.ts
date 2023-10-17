import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class UnFollowUserInput {
  @Field(() => Number)
  targetUserId: number;
}

@ObjectType()
export class UnFollowUserOutput extends BaseOutput {}
