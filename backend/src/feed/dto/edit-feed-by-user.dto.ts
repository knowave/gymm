import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';
import { Feed } from '../entities/feed.entity';

@InputType()
export class EditFeedByUserInput extends PartialType(Feed) {
  @Field(() => Number)
  feedId: number;
}

@ObjectType()
export class EditFeedByUserOutput extends BaseOutput {}
