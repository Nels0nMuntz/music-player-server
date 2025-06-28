import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTrackInput {
  @Field()
  title!: string;

  @Field()
  artist!: string;

  @Field({ nullable: true })
  album?: string;

  @Field(() => [String])
  genres!: string[];

  @Field({ nullable: true })
  coverImage?: string;
}
