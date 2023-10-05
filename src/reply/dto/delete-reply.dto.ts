import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class DeleteReplyInput {
  @Field(() => Number)
  replyId: number;

  @Field(() => Number, { nullable: true })
  feedId?: number;

  @Field(() => Number, { nullable: true })
  gymId?: number;
}

@ObjectType()
export class DeleteReplyOutput extends BaseOutput {}
