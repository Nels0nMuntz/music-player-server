import { Field, ObjectType } from "type-graphql";
import { TracksMeta } from "./TracksMeta";
import { Track } from "./Track";

@ObjectType()
export class TracksResponse {
  @Field(() => [Track])
  data!: Track[];

  @Field(() => TracksMeta)
  meta!: TracksMeta;
}
