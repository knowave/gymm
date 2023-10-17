import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Reply } from '../entities/reply.entity';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class WriteReplyByGymInput extends PartialType(Reply) {
  @Field(() => Number)
  gymId: number;
}

@ObjectType()
export class WriteReplyByGymOutput extends BaseOutput {}
