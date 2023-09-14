import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { Entity, ManyToOne } from 'typeorm';

@InputType('replyInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Reply extends BaseEntity {
  @Field(() => Feed, { nullable: true })
  @ManyToOne(() => Feed, (feed) => feed.replies, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  feed?: Feed;

  @Field(() => Gym, { nullable: true })
  @ManyToOne(() => Gym, (gym) => gym.replies, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  gym?: Gym;
}
