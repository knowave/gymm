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
import {
  ToggleLikeToGymInput,
  ToggleLikeToGymOutput,
} from './dto/toggle-like-to-gym.dto';
import {
  ToggleLikeToReplyInput,
  ToggleLikeToReplyOutput,
} from './dto/toggel-like-to-reply.dto';
import { Reply } from 'src/reply/entities/reply.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
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

        feed.likeCount++;
        await queryRunner.manager.save(feed);
        await queryRunner.manager.save(liked);
        await queryRunner.commitTransaction();

        return { ok: true, feedLike: true };
      } else {
        feed.likeCount--;
        await queryRunner.manager.save(feed);
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

  async toggleLikeToGym(
    { gymId }: ToggleLikeToGymInput,
    user: User,
  ): Promise<ToggleLikeToGymOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gym = await this.gymRepository.findOne({ where: { id: gymId } });
      const like = await this.likeRepository.findOne({
        relations: ['gym', 'user'],
        where: { gym: { id: gymId }, user: { id: user.id } },
      });

      if (!gym) return { ok: false, error: '존재하는 Gym이 없습니다.' };

      if (!like) {
        const liked = queryRunner.manager.create(Like, {
          gym: gym,
          user: user,
        });

        gym.likeCount++;
        await queryRunner.manager.save(gym);
        await queryRunner.manager.save(liked);
        await queryRunner.commitTransaction();
        return { ok: true, gymLike: true };
      } else {
        gym.likeCount--;
        await queryRunner.manager.save(gym);
        await queryRunner.manager.softRemove(Like, like);
        await queryRunner.commitTransaction();
        return { ok: true, gymLike: false };
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async toggleLikeToReply(
    { replyId }: ToggleLikeToReplyInput,
    user: User,
  ): Promise<ToggleLikeToReplyOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reply = await this.replyRepository.findOne({
        where: { id: replyId },
      });
      const like = await this.likeRepository.findOne({
        relations: ['reply', 'user'],
        where: { gym: { id: replyId }, user: { id: user.id } },
      });

      if (!reply) return { ok: false, error: '존재하는 댓글이 없습니다.' };

      if (!like) {
        const liked = queryRunner.manager.create(Like, {
          reply: reply,
          user: user,
        });

        reply.likeCount++;
        await queryRunner.manager.save(reply);
        await queryRunner.manager.save(liked);
        await queryRunner.commitTransaction();
        return { ok: true, replyLike: true };
      } else {
        reply.likeCount--;
        await queryRunner.manager.save(reply);
        await queryRunner.manager.softRemove(Like, like);
        await queryRunner.commitTransaction();
        return { ok: true, replyLike: false };
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
