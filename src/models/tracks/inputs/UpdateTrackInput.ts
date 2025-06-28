import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateTrackInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  artist?: string;

  @Field({ nullable: true })
  album?: string;

  @Field(() => [String], { nullable: true })
  genres?: string[];

  @Field({ nullable: true })
  coverImage?: string;

  @Field({ nullable: true })
  audioFile?: string;
}
