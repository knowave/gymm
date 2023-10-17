import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Reply } from '../entities/reply.entity';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class WriteReplyByFeedInput extends PartialType(Reply) {
  @Field(() => Number)
  feedId: number;
}

@ObjectType()
export class WriteReplyByFeedOutput extends BaseOutput {}
