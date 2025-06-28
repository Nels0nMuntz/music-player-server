import { Resolver, Query } from "type-graphql";
import { getGenres } from "../../utils/db";

@Resolver()
export class GenresResolver {
  @Query(() => [String])
  async genres(): Promise<string[]> {
    try {
      return await getGenres();
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw new Error("Internal Server Error");
    }
  }
}
