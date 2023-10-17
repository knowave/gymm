import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CreateTrainerByUserInput,
  CreateTrainerByUserOutput,
} from './dto/create-trainer-by-user.input';
import { UserRole } from 'src/user/enums/user-role.enum';

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createTrainerByUser(
    { role }: CreateTrainerByUserInput,
    user: User,
  ): Promise<CreateTrainerByUserOutput> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userForTrainer = await this.userRepository.findOne({
        where: { id: user.id },
      });

      if (!userForTrainer)
        return { ok: false, error: '존재하지 않는 사용자입니다.' };

      if (role === UserRole.CLIENT) {
        return { ok: false, error: '다시 한번 역할을 확인해 주세요.' };
      }

      userForTrainer.role = role;

      await queryRunner.manager.save(userForTrainer);
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
