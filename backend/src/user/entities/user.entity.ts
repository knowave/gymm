import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Like } from 'src/like/entities/like.entity';
import { Reply } from 'src/reply/entities/reply.entity';

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String, { nullable: true })
  @IsEmail({}, { message: '잘못된 이메일 형식입니다.' })
  @Column({ nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Column({ nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(8, 20, { message: '비밀번호는 최소 8에서 최대 20자이어야 합니다.' })
  @Matches(/^(?=.*[!@#$%^&*])/gm, {
    message: '비밀번호에는 특수문자 최소 1개가 포함되어야 합니다.',
  })
  @Column({ nullable: true })
  password?: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  blocked?: boolean;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  jwtToken?: string;

  @Field(() => UserRole, { defaultValue: UserRole.CLIENT })
  @Column('enum', { enum: UserRole, default: UserRole.CLIENT })
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => [Feed], { nullable: true })
  @OneToMany(() => Feed, (feed) => feed.user, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  feeds?: Feed[];

  @Field(() => [Gym], { nullable: true })
  @OneToMany(() => Gym, (gym) => gym.user, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  gyms?: Gym[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.following, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  followers?: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.followers, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  following?: User[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.user, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  likes?: Like[];

  @Field(() => [Reply], { nullable: true })
  @OneToMany(() => Reply, (reply) => reply.user, {
    nullable: true,
    onDelete: 'CASCADE',
    cascade: ['soft-remove'],
  })
  replies: Reply[];
}
