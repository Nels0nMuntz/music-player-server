import { Field, ObjectType } from "type-graphql";
import { Track } from "./Track";

@ObjectType()
export class UploadTrackResponse {
  @Field(() => Track)
  track!: Track;

  @Field()
  filename!: string;
}
