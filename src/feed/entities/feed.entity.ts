import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { Like } from 'src/like/entities/like.entity';
import { Reply } from 'src/reply/entities/reply.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { FeedStatus } from '../enums/feed-status.enum';

@InputType('feedInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Feed extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => FeedStatus, { defaultValue: FeedStatus.PUBLIC })
  @Column('enum', {
    enum: FeedStatus,
    default: FeedStatus.PUBLIC,
  })
  status: FeedStatus;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  likeCount?: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.feeds, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  user?: User;

  @Field(() => [Gym], { nullable: true })
  @OneToMany(() => Gym, (gym) => gym.feeds, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  gym?: Gym;

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.feed, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  likes?: Like[];

  @Field(() => [Reply], { nullable: true })
  @OneToMany(() => Reply, (reply) => reply.feed, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  replies?: Reply[];
}
