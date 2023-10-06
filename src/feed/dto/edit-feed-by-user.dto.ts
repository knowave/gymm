import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';
import { FeedStatus } from '../enums/feed-status.enum';

@InputType()
export class EditFeedByUserInput {
  @Field(() => Number)
  feedId: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => FeedStatus, { nullable: true })
  status?: FeedStatus;
}

@ObjectType()
export class EditFeedByUserOutput extends BaseOutput {}
