import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Gym } from '../entities/gym.entity';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class CreateGymByTrainerInput extends PartialType(Gym) {}

@ObjectType()
export class CreateGymByTrainerOutput extends BaseOutput {}
