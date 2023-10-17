import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';
import { Feed } from '../entities/feed.entity';

@InputType()
export class GetFeedByIdInput {
  @Field(() => Number)
  feedId: number;
}

@ObjectType()
export class GetFeedByIdOutput extends BaseOutput {
  @Field(() => Feed, { nullable: true })
  feed?: Feed;
}
