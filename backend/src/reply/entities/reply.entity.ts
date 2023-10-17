import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@InputType('replyInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Reply extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  content?: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  likeCount?: number;

  @Field(() => Feed, { nullable: true })
  @ManyToOne(() => Feed, (feed) => feed.replies, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  feed?: Feed;

  @Field(() => Gym, { nullable: true })
  @ManyToOne(() => Gym, (gym) => gym.replies, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  gym?: Gym;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.replies, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  user?: User;

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.reply, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  likes?: Like[];
}
