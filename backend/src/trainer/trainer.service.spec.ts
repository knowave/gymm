import { DataSource, QueryRunner, Repository } from 'typeorm';
import { TrainerService } from './trainer.service';
import { User } from 'src/user/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { createConnection } from 'mysql2';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from 'src/user/enums/user-role.enum';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softRemove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockQueryRunner = {
  manager: {},
} as QueryRunner;

class MockDataSource {
  createQueryRunner(mode?: 'master' | 'stave'): QueryRunner {
    return mockQueryRunner;
  }
}

describe('TrainerService', () => {
  let trainerService: TrainerService;
  let userRepository: MockRepository<User>;
  let mockDataSource: DataSource;

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
    mockDataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrainerByUser', () => {
    it('기존 User가 Trainer로 변경되었을 시 Transaction Commit이 되고, Rollback은 되지 않는다.', async () => {
      const user = new User();
      user.id = 1;
      user.role = UserRole.CLIENT;

      userRepository.findOne.mockResolvedValue(user);

      const queryRunner = mockDataSource.createQueryRunner();
      const result = await trainerService.createTrainerByUser(
        { role: UserRole.TRAINER },
        user,
      );

      jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(user);

      expect(queryRunner.manager.save).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(queryRunner.connect).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });

    it('user가 없을 경우 Trainer 생성이 실패된다.', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await trainerService.createTrainerByUser(
        { role: UserRole.TRAINER },
        new User(),
      );

      const queryRunner = mockDataSource.createQueryRunner();

      expect(queryRunner.manager.save).toHaveBeenCalledTimes(0);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(queryRunner.connect).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        ok: false,
        error: '존재하지 않는 사용자입니다.',
      });
    });

    it('기존 user가 role을 TRAINER가 아닌 CLIENT를 선택할 시 실패된디.', async () => {
      const user = new User();
      user.id = 1;
      user.role = UserRole.CLIENT;

      userRepository.findOne.mockResolvedValue(user);

      const result = await trainerService.createTrainerByUser(
        { role: UserRole.CLIENT },
        user,
      );

      const queryRunner = mockDataSource.createQueryRunner();

      expect(queryRunner.manager.save).toHaveBeenCalledTimes(0);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(queryRunner.connect).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
      expect(queryRunner.release).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        ok: false,
        error: '다시 한번 역할을 확인해 주세요.',
      });
    });
  });
});
