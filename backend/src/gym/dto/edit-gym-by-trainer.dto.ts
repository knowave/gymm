import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "src/common/dto/base-output.dto";

@InputType()
export class EditGymByTrainerInput {
    @Field(() => Number)
    gymId: number;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => String, { nullable: true })
    gymInfo?: string;

    @Field(() => String, { nullable: true })
    location?: string;
}

@ObjectType()
export class EditGymByTrainerOutput extends BaseOutput {}