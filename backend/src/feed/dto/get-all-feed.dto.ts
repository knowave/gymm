import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Feed } from '../entities/feed.entity';

export enum FeedSearchType {
  TITLE = 'TITLE',
}

registerEnumType(FeedSearchType, {
  name: 'FeedSearchType',
});

@InputType()
export class GetAllFeedInput extends PaginationInput {
  @Field(() => Number, { nullable: true })
  skip?: number;

  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => FeedSearchType, { nullable: true })
  searchtype?: FeedSearchType;
}

@ObjectType()
export class GetAllFeedOutput extends PaginationOutput {
  @Field(() => [Feed], { nullable: true })
  totalFeeds?: Feed[];
}
