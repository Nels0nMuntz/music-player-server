import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class BatchDeleteResponse {
  @Field(() => [String])
  success!: string[];

  @Field(() => [String])
  failed!: string[];
}
