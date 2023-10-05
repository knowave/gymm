import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import {
  ToggleLikeToFeedInput,
  ToggleLikeToFeedOutput,
} from './dto/toggle-like-to-feed-dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly dataSource: DataSource,
  ) {}

  async toggleLikeToFeed(
    { feedId }: ToggleLikeToFeedInput,
    user: User,
  ): Promise<ToggleLikeToFeedOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const feed = await this.feedRepository.findOne({
        where: { id: feedId },
      });

      const like = await this.likeRepository.findOne({
        relations: ['feed', 'user'],
        where: { feed: { id: feedId }, user: { id: user.id } },
      });

      if (!feed) {
        return { ok: false, error: '존재하는 Feed가 없습니다.' };
      }

      if (!like) {
        const liked = queryRunner.manager.create(Like, {
          feed: feed,
          user: user,
        });
        await queryRunner.manager.save(liked);
        await queryRunner.commitTransaction();
        return { ok: true, feedLike: true };
      } else {
        await queryRunner.manager.softRemove(Like, like);
        await queryRunner.commitTransaction();
        return { ok: true, feedLike: false };
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
