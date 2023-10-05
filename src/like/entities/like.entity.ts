import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@InputType('likeInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Like extends BaseEntity {
  @Field(() => Feed, { nullable: true })
  @ManyToOne(() => Feed, (feed) => feed.likes, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  feed?: Feed;

  @Field(() => Gym, { nullable: true })
  @ManyToOne(() => Gym, (gym) => gym.likes, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  gym?: Gym;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.likes, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  user?: User;
}
