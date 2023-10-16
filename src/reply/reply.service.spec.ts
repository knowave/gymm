import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ReplyService } from './reply.service';
import { Reply } from './entities/reply.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { createConnection } from 'mysql2';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { WriteReplyByFeedInput } from './dto/write-reply-by-feed.dto';
import { Gym } from 'src/gym/entities/gym.entity';
import { WriteReplyByGymInput } from './dto/write-reply-by-gym.dto';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReplyService', () => {
  let replyService: ReplyService;
  let replyRepository: MockRepository<Reply>;
  let feedRepository: MockRepository<Feed>;
  let userRepository: MockRepository<User>;
  let gymRepository: MockRepository<Gym>;
  let dataSource: DataSource;

  let user: User;
  let feed: Feed;
  let gym: Gym;

  const mockQueryRunner = {
    manager: {},
  } as QueryRunner;

  class MockDataSource {
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return mockQueryRunner;
    }
  }

  beforeEach(async () => {
    user = new User();
    feed = new Feed();
    gym = new Gym();

    Object.assign(mockQueryRunner.manager, {
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    });

    mockQueryRunner.connect = jest.fn();
    mockQueryRunner.startTransaction = jest.fn();
    mockQueryRunner.commitTransaction = jest.fn();
    mockQueryRunner.rollbackTransaction = jest.fn();
    mockQueryRunner.release = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplyService,
        {
          provide: DataSource,
          useClass: MockDataSource,
        },
        {
          provide: createConnection,
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Reply),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Feed),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Gym),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    replyService = module.get<ReplyService>(ReplyService);
    replyRepository = module.get<MockRepository<Reply>>(
      getRepositoryToken(Reply),
    );
    feedRepository = module.get<MockRepository<Feed>>(getRepositoryToken(Feed));
    gymRepository = module.get<MockRepository<Gym>>(getRepositoryToken(Gym));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('WriteReplyByFeed', () => {
    it('현재 user가 존재하고, feed도 존재하면 reply 작성이 성공한다.', async () => {
      user.id = 1;
      feed.id = 1;

      const mockWriteReply: WriteReplyByFeedInput = {
        feedId: feed.id,
        content: 'test',
      };

      feedRepository.findOne.mockResolvedValue(feed);

      const queryRunner = dataSource.createQueryRunner();

      jest
        .spyOn(queryRunner.manager, 'create')
        .mockReturnValue([mockWriteReply]);
      jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(mockWriteReply);

      const result = await replyService.writeReplyByFeed(mockWriteReply, user);

      expect(feedRepository.findOne).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.create).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(1);
      expect(queryRunner.connect).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ ok: true });
    });

    it('feed는 존재하는데, user가 존재하지 않으면 reply 작성은 실패한다.', async () => {
      feed.id = 2;

      const mockWriteReply: WriteReplyByFeedInput = {
        feedId: feed.id,
        content: 'test',
      };

      feedRepository.findOne.mockResolvedValue(feed);

      const queryRunner = dataSource.createQueryRunner();

      jest
        .spyOn(queryRunner.manager, 'create')
        .mockReturnValue([mockWriteReply]);
      jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(mockWriteReply);

      const result = await replyService.writeReplyByFeed(mockWriteReply, null);

      expect(feedRepository.findOne).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.create).toHaveBeenCalledTimes(0);
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(0);
      expect(queryRunner.connect).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ ok: false, error: '존재하는 user가 없습니다.' });
    });
  });

  describe('writeReplyByGym', () => {
    it('현재 user가 존재하고, gym이 존재한다면 gym에 댓글 작성이 성공한다.', async () => {
      user.id = 1;
      gym.id = 1;

      const mockWriteReplyByGym: WriteReplyByGymInput = {
        gymId: gym.id,
        content: 'gymgymgym',
      };

      gymRepository.findOne.mockResolvedValue(gym);

      const queryRunner = dataSource.createQueryRunner();

      jest
        .spyOn(queryRunner.manager, 'create')
        .mockReturnValue([mockWriteReplyByGym]);
      jest
        .spyOn(queryRunner.manager, 'save')
        .mockResolvedValue(mockWriteReplyByGym);

      const result = await replyService.writeReplyByGym(
        mockWriteReplyByGym,
        user,
      );

      expect(gymRepository.findOne).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.create).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(1);
      expect(queryRunner.connect).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });
  });
});
