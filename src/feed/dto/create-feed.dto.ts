import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Feed } from '../entities/feed.entity';
import { BaseOutput } from 'src/common/base-output.dto';

@InputType()
export class CreateFeedInput extends PartialType(Feed) {}

@ObjectType()
export class CreateFeedOutput extends BaseOutput {}