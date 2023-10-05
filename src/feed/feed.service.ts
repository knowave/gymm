import { Injectable } from '@nestjs/common';
import { CreateFeedInput, CreateFeedOutput } from './dto/create-feed.dto';
import { DataSource, ILike, Repository } from 'typeorm';
import { Feed } from './entities/feed.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  FeedSearchType,
  GetAllFeedInput,
  GetAllFeedOutput,
} from './dto/get-all-feed.dto';
import { GetFeedByIdInput, GetFeedByIdOutput } from './dto/get-feed-by-id.dto';
import {
  EditFeedByUserInput,
  EditFeedByUserOutput,
} from './dto/edit-feed-by-user.dto';
import {
  DeleteFeedByUserInput,
  DeleteFeedByUserOutput,
} from './dto/delete-feed-by-user.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createFeed(
    user: User,
    { title, ...createFeedInput }: CreateFeedInput,
  ): Promise<CreateFeedOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!title) {
        return { ok: false, error: 'title을 적어주세요.' };
      }

      const createdFeed = queryRunner.manager.create(Feed, {
        title,
        user,
        ...createFeedInput,
      });

      await queryRunner.manager.save(createdFeed);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllFeed({
    page,
    skip,
    query,
    searchtype,
  }: GetAllFeedInput): Promise<GetAllFeedOutput> {
    try {
      const take = skip ? skip : null;

      const where = {
        title: searchtype === FeedSearchType.TITLE ? ILike(`%${query}%`) : null,
      };

      where.title ? where.title : delete where['title'];

      const [totalFeeds, totalResults] = await this.feedRepository.findAndCount(
        {
          relations: ['user', 'like'],
          where,
          skip: (page - 1) * take,
          take,
          order: { createdAt: 'DESC' },
        },
      );

      return {
        ok: true,
        totalFeeds,
        totalPages: skip ? Math.ceil(totalResults / take) : null,
        totalResults,
      };
    } catch (err) {
      throw err;
    }
  }

  async getFeedById({ feedId }: GetFeedByIdInput): Promise<GetFeedByIdOutput> {
    try {
      const feed = await this.feedRepository.findOne({
        relations: ['user', 'like', 'reply', 'gym'],
        where: { id: feedId },
      });

      if (!feed) {
        return { ok: false, error: '존재하는 게시물이 없습니다.' };
      }

      return { ok: true, feed };
    } catch (err) {
      throw err;
    }
  }

  async editFeedByUser(
    { feedId, title, description, status }: EditFeedByUserInput,
    user: User,
  ): Promise<EditFeedByUserOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const feed = await this.feedRepository.findOne({
        relations: ['user'],
        where: { id: feedId, user: { id: user.id } },
      });

      if (!feed) return { ok: false, error: '존재하는 게시물이 없습니다.' };

      feed.title = title;
      feed.description = description;
      feed.status = status;

      await queryRunner.manager.save(Feed, feed);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFeedByUser(
    { feedId }: DeleteFeedByUserInput,
    user: User,
  ): Promise<DeleteFeedByUserOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const feed = await this.feedRepository.findOne({
        where: { id: feedId, user: { id: user.id } },
      });

      if (!feed) return { ok: false, error: '존재하지 않는 게시물입니다.' };

      await queryRunner.manager.softRemove(Feed, feed);
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
