import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { FollowUserInput, FollowUserOutput } from './dto/follow-user.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async followUser(
    { targetUserId }: FollowUserInput,
    user: User,
  ): Promise<FollowUserOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      const targetUser = await this.userRepository.findOne({
        where: { id: targetUserId },
      });

      if (!currentUser)
        return { ok: false, error: '존재하는 user가 없습니다.' };
      if (!targetUser)
        return { ok: false, error: 'Follow를 하고자 하는 user가 없습니다.' };

      if (currentUser.following) currentUser.following = [];
      if (targetUser.followers) targetUser.followers = [];

      const isFollowing = currentUser.following.some(
        (u) => u.id === targetUserId,
      );

      if (isFollowing) {
        // 이미 팔로우 중이면 예외처리
        return { ok: false, error: '이미 Follow중 입니다.' };
      } else {
        // 팔오우를 하고 있지 않으면 팔로우
        currentUser.following.push(targetUser);
        targetUser.followers.push(currentUser);
      }

      await queryRunner.manager.save([currentUser, targetUser]);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
