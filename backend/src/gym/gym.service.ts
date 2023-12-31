import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from './entities/gym.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  CreateGymByTrainerInput,
  CreateGymByTrainerOutput,
} from './dto/create-gym-by-trainer.dto';
import {
  GetAllGymInput,
  GetAllGymOutput,
  GymSearchType,
} from './dto/get-all-gym.dto';
import { GetGymByIdInput, GetGymByIdOutput } from './dto/get-gym-by-id.dto';
import { sortByCreatedAtDesc } from 'src/common/constant/common.functions';
import {
  EditGymByTrainerInput,
  EditGymByTrainerOutput,
} from './dto/edit-gym-by-trainer.dto';
import { UserRole } from 'src/user/enums/user-role.enum';
import {
  DeleteGymByTrainerInput,
  DeleteGymByTrainerOutput,
} from './dto/delete-gym-by-trainer.dto';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createGymByTrainer(
    { name, gymInfo, location }: CreateGymByTrainerInput,
    user: User,
  ): Promise<CreateGymByTrainerOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!name)
        return {
          ok: false,
          error: '등록하고자 하는 Gym 이름을 기재해 주세요.',
        };

      if (!gymInfo)
        return {
          ok: false,
          error: '등록하고자 하는 Gym 정보를 기재해 주세요.',
        };

      if (!location)
        return {
          ok: false,
          error: '등록하고자 하는 Gym 위치를 기재해 주세요.',
        };

      const createGym = queryRunner.manager.create(Gym, {
        name,
        gymInfo,
        location,
        user,
      });

      await queryRunner.manager.save(createGym);
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllGym({
    page,
    skip,
    query,
    searchtype,
  }: GetAllGymInput): Promise<GetAllGymOutput> {
    try {
      const take = skip ? skip : null;

      const where = {
        name: searchtype === GymSearchType.NAME ? ILike(`%${query}%`) : null,
      };

      where.name ? where.name : delete where['name'];

      const [totalGyms, totalResults] = await this.gymRepository.findAndCount({
        relations: ['user', 'like'],
        where,
        skip: (page - 1) * take,
        take,
        order: { createdAt: 'DESC' },
      });

      return {
        ok: true,
        totalGyms,
        totalPages: skip ? Math.ceil(totalResults / take) : null,
        totalResults,
      };
    } catch (err) {
      throw err;
    }
  }

  async getGymById({ gymId }: GetGymByIdInput): Promise<GetGymByIdOutput> {
    try {
      const gym = await this.gymRepository.findOne({
        relations: ['user', 'feed', 'like', 'reply'],
        where: { id: gymId },
      });

      if (!gym) return { ok: false, error: '존재하는 Gym이 없습니다.' };

      // Gym의 Feed를 createdAt 내림차순
      if (gym.feeds) {
        gym.feeds.sort(sortByCreatedAtDesc);
      }

      // Gym의 Reply를 createdAt 내림차순
      if (gym.replies) {
        gym.replies.sort(sortByCreatedAtDesc);
      }

      // Gym의 Feed와 Reply를 5개만 출력
      gym.feeds = gym.feeds.slice(0, 5);
      gym.replies = gym.replies.slice(0, 5);
      return { ok: true, gym };
    } catch (err) {
      throw err;
    }
  }

  async editGymByTrainer(
    { gymId, name, gymInfo, location }: EditGymByTrainerInput,
    user: User,
  ): Promise<EditGymByTrainerOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gym = await this.gymRepository.findOne({
        relations: ['user'],
        where: { id: gymId, user: { id: user.id, role: UserRole.TRAINER } },
      });

      if (!gym) return { ok: false, error: '존재하는 Gym이 없습니다.' };

      gym.name = name;
      gym.gymInfo = gymInfo;
      gym.location = location;
      await queryRunner.commitTransaction();
      return { ok: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteGymByTrainer(
    { gymId }: DeleteGymByTrainerInput,
    user: User,
  ): Promise<DeleteGymByTrainerOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gym = await this.gymRepository.findOne({
        relations: ['user'],
        where: { id: gymId, user: { id: user.id, role: UserRole.TRAINER } },
      });

      if (!gym) return { ok: false, error: '존재하는 Gym이 없습니다.' };

      await queryRunner.manager.softRemove(Gym, gym);
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
