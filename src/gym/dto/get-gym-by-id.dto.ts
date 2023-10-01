import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "src/common/dto/base-output.dto";
import { Gym } from "../entities/gym.entity";

@InputType()
export class GetGymByIdInput {
    @Field(() => Number)
    gymId: number;
}

@ObjectType()
export class GetGymByIdOutput extends BaseOutput {
    @Field(() => Gym, { nullable: true })
    gym?: Gym
}