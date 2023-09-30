import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Gym } from '../entities/gym.entity';

export enum GymSearchType {
  NAME = 'NAME',
}

registerEnumType(GymSearchType, {
  name: 'GymSearchType',
});

@InputType()
export class GetAllGymInput extends PaginationInput {
  @Field(() => Number, { nullable: true })
  skip?: number;

  @Field(() => String, { nullable: true })
  query?: string;

  @Field(() => GymSearchType, { nullable: true })
  searchtype?: GymSearchType;
}

@ObjectType()
export class GetAllGymOutput extends PaginationOutput {
  @Field(() => [Gym], { nullable: true })
  totalGyms?: Gym[];
}
