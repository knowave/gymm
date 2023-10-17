import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "./base-output.dto";

@InputType()
export class PaginationInput {
    @Field(() => Number, { defaultValue: 1, nullable: true })
    page?: number;
}

@ObjectType()
export class PaginationOutput extends BaseOutput {
    @Field(() => Number, { nullable: true })
    totalPages?: number;

    @Field(() => Number, { nullable: true })
    totalResults?: number;
}