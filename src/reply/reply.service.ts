import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Reply } from './entities/reply.entity';
import {
  WriteReplyByFeedInput,
  WriteReplyByFeedOutput,
} from './dto/write-reply-by-feed.dto';
import {
  WriteReplyByGymInput,
  WriteReplyByGymOutput,
} from './dto/write-reply-by-gym.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly dataSource: DataSource,
  ) {}

  async writeReplyByFeed(
    { feedId, content, ...writeReplyByFeedInput }: WriteReplyByFeedInput,
    user: User,
  ): Promise<WriteReplyByFeedOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const feed = await this.feedRepository.findOne({
        where: { id: feedId },
      });

      if (!feed) return { ok: false, error: '존재하는 Feed가 없습니다.' };

      if (!content)
        return { ok: false, error: '작성하고자 하는 댓글 내용을 적어주세요.' };

      const writeReply = queryRunner.manager.create(Reply, {
        content,
        feed,
        user: user,
        ...writeReplyByFeedInput,
      });

      await queryRunner.manager.save(writeReply);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async writeReplyByGym(
    { gymId, content, ...writeReplyByGymInput }: WriteReplyByGymInput,
    user: User,
  ): Promise<WriteReplyByGymOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gym = await this.gymRepository.findOne({
        where: { id: gymId },
      });

      if (!gym) return { ok: false, error: '존재하는 Gym이 없습니다.' };

      if (!content)
        return { ok: false, error: '작성하고자 하는 댓글 내용을 적어주세요.' };

      const writeReply = queryRunner.manager.create(Reply, {
        content,
        gym,
        user: user,
        ...writeReplyByGymInput,
      });

      await queryRunner.manager.save(writeReply);
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
