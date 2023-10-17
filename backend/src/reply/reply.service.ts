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
import {
  EditReplyByFeedInput,
  EditReplyByFeedOutput,
} from './dto/edit-reply-by-feed.dto';
import {
  EditReplyByGymInput,
  EditReplyByGymOutput,
} from './dto/edit-reply-by-gym.dto';
import { DeleteReplyInput, DeleteReplyOutput } from './dto/delete-reply.dto';

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

      if (!user) {
        return { ok: false, error: '존재하는 user가 없습니다.' };
      }

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

      if (!user) {
        return { ok: false, error: '존재하는 user가 없습니다.' };
      }

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

  async editReplyByFeed(
    { feedId, replyId, content }: EditReplyByFeedInput,
    user: User,
  ): Promise<EditReplyByFeedOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const feed = await this.feedRepository.findOne({
        where: { id: feedId },
      });
      const reply = await this.replyRepository.findOne({
        relations: ['feed', 'user'],
        where: { id: replyId, feed: { id: feedId }, user: { id: user.id } },
      });

      if (!feed) return { ok: false, error: '존재하는 Feed가 없습니다.' };
      if (!reply) return { ok: false, error: '존재하는 댓글이 없습니다.' };

      reply.content = content;

      await queryRunner.manager.save(reply);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async editReplyByGym(
    { gymId, replyId, content }: EditReplyByGymInput,
    user: User,
  ): Promise<EditReplyByGymOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gym = await this.gymRepository.findOne({
        where: { id: gymId },
      });
      const reply = await this.replyRepository.findOne({
        relations: ['gym', 'user'],
        where: { id: replyId, gym: { id: gymId }, user: { id: user.id } },
      });

      if (!gym) return { ok: false, error: '존재하는 Gym이 없습니다.' };
      if (!reply) return { ok: false, error: '존재하는 댓글이 없습니다.' };

      reply.content = content;

      await queryRunner.manager.save(reply);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteReplyByFeed(
    { replyId, feedId }: DeleteReplyInput,
    user: User,
  ): Promise<DeleteReplyOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reply = await this.replyRepository.findOne({
        relations: ['feed', 'user'],
        where: { id: replyId, feed: { id: feedId }, user: { id: user.id } },
      });

      if (!reply) return { ok: false, error: '존재하는 댓글이 없습니다.' };

      await queryRunner.manager.softRemove(Reply, reply);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteReplyByGym(
    { replyId, gymId }: DeleteReplyInput,
    user: User,
  ): Promise<DeleteReplyOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reply = await this.replyRepository.findOne({
        relations: ['gym', 'user'],
        where: {
          id: replyId,
          feed: { id: gymId },
          user: { id: user.id },
        },
      });

      if (!reply) return { ok: false, error: '존재하는 댓글이 없습니다.' };

      await queryRunner.manager.softRemove(Reply, reply);
      await queryRunner.commitTransaction();
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
