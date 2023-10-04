import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common/dto/base-output.dto';

@InputType()
export class DeleteGymByTrainerInput {
  @Field(() => Number)
  gymId: number;
}

@ObjectType()
export class DeleteGymByTrainerOutput extends BaseOutput {}
