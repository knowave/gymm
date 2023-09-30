import { PartialType } from "@nestjs/graphql";
import { Gym } from "../entities/gym.entity";
import { BaseOutput } from "src/common/dto/base-output.dto";

export class CreateGymByTrainerInput extends PartialType(Gym) {}

export class CreateGymByTrainerOutput extends BaseOutput {}