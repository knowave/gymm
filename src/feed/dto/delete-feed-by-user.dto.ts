import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "src/common/dto/base-output.dto";

@InputType()
export class DeleteFeedByUserInput {
    @Field(() => Number)
    feedId: number;
}

@ObjectType()
export class DeleteFeedByUserOutput extends BaseOutput {}