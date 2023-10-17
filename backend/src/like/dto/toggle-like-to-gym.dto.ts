import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class ToggleLikeToGymInput {
  @Field(() => Number)
  gymId: number;
}

@ObjectType()
export class ToggleLikeToGymOutput extends BaseOutput {
  @Field(() => Boolean, { nullable: true })
  gymLike?: boolean;
}
