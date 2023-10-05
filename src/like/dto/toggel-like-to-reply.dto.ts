import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class ToggleLikeToReplyInput {
  @Field(() => Number)
  replyId: number;
}

@ObjectType()
export class ToggleLikeToReplyOutput extends BaseOutput {
  @Field(() => Boolean, { nullable: true })
  replyLike?: boolean;
}
