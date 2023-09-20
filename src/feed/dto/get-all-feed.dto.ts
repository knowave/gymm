import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Feed, FeedStatus } from '../entities/feed.entity';

@InputType()
export class GetAllFeedInput extends PaginationInput {
  @Field(() => Number, { nullable: true })
  skip?: number;

  @Field(() => FeedStatus, { nullable: true })
  status?: FeedStatus;

  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => String, { nullable: true })
  title: string;
}

@ObjectType()
export class GetAllFeedOutput extends PaginationOutput {
  @Field(() => [Feed], { nullable: true })
  totalFeeds?: Feed[];
}
