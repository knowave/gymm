import { DataSource, QueryRunner, Repository } from 'typeorm';
import { TrainerService } from './trainer.service';
import { User } from 'src/user/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { createConnection } from 'mysql2';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softRemove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TrainerService', () => {
  let trainerService: TrainerService;
  let userRepository: MockRepository<User>;
  let dataSource: DataSource;

  const mockQueryRunner = {
    manager: {},
  } as QueryRunner;

  class MockDataSource {
    createQueryRunner(mode?: 'master' | 'stave'): QueryRunner {
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
        TrainerService,
        {
          provide: DataSource,
          useClass: MockDataSource,
        },
        {
          provide: createConnection,
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    trainerService = module.get<TrainerService>(TrainerService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
