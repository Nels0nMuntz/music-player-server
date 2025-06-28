import { InputType, Field, Int } from "type-graphql";

@InputType()
export class TracksInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field({ nullable: true })
  sort?: "title" | "artist" | "album" | "createdAt";

  @Field({ nullable: true })
  order?: "asc" | "desc";

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  genre?: string;

  @Field({ nullable: true })
  artist?: string;
}
