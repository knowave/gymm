import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class ToggleLikeToFeedInput {
  @Field(() => Number)
  feedId: number;
}

@ObjectType()
export class ToggleLikeToFeedOutput extends BaseOutput {
  @Field(() => Boolean, { nullable: true })
  feedLike?: boolean;
}
