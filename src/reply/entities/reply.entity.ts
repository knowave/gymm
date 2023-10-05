import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('replyInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Reply extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  content?: string;

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

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.replies, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  user?: User;
}
