import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { Like } from 'src/like/entities/like.entity';
import { Reply } from 'src/reply/entities/reply.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

export enum FeedStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

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

  @Column({ enum: FeedStatus, type: 'enum', default: FeedStatus.PUBLIC })
  @Field(() => FeedStatus)
  @IsEnum(FeedStatus)
  status: FeedStatus;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  likeCount?: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.feeds, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  user?: User;

  @Field(() => [Gym], { nullable: true })
  @OneToMany(() => Gym, (gym) => gym.feeds, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  gym?: Gym;

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.feed, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  likes?: Like[];

  @Field(() => [Reply], { nullable: true })
  @OneToMany(() => Reply, (reply) => reply.feed, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  replies?: Reply[];
}
