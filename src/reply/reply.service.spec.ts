import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ReplyService } from './reply.service';
import { Reply } from './entities/reply.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { createConnection } from 'mysql2';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReplyService', () => {
  let replyService: ReplyService;
  let replyRepository: MockRepository<Reply>;
  let dataSource: DataSource;

  const mockQueryRunner = {
    manager: {},
  } as QueryRunner;

  class MockDataSource {
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return mockQueryRunner;
    }
  }

  beforeEach(async () => {
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
      ],
    }).compile();

    replyService = module.get<ReplyService>(ReplyService);
    replyRepository = module.get<MockRepository<Reply>>(
      getRepositoryToken(Reply),
    );
    dataSource = module.get<DataSource>(MockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
