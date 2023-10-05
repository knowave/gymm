import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class EditReplyByGymInput {
  @Field(() => Number)
  gymId: number;

  @Field(() => Number)
  replyId: number;

  @Field(() => String, { nullable: true })
  content?: string;
}

@ObjectType()
export class EditReplyByGymOutput extends BaseOutput {}
