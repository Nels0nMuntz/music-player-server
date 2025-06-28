import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class TracksMeta {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}
