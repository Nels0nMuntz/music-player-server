import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Track {
  @Field((type) => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  artist!: string;

  @Field({ nullable: true })
  album?: string;

  @Field((type) => [String])
  genres!: string[];

  @Field()
  slug!: string;

  @Field({ nullable: true })
  coverImage?: string;

  @Field({ nullable: true })
  audioFile?: string;

  @Field(() => String)
  createdAt!: string;

  @Field(() => String)
  updatedAt!: string;
}
