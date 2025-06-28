import { Resolver, Query, Arg, Mutation, ID } from "type-graphql";
import {
  createTrack,
  deleteAudioFile,
  deleteMultipleTracks,
  deleteTrack,
  getTrackById,
  getTrackBySlug,
  getTracks,
  updateTrack,
} from "../../utils/db";
import { createSlug } from "../../utils/slug";
import { Track } from "./objects/Track";
import { TracksInput } from "./inputs/TracksInput";
import { TracksResponse } from "./objects/TracksResponse";
import { CreateTrackInput } from "./inputs/CreateTrackInput";
import { UpdateTrackInput } from "./inputs/UpdateTrackInput";
import { BatchDeleteResponse } from "./objects/BatchDeleteResponse";

@Resolver()
export class TracksResolver {
  @Query(() => TracksResponse)
  async tracks(
    @Arg("params", () => TracksInput, { nullable: true })
    params?: TracksInput
  ): Promise<TracksResponse> {
    try {
      const { page = 1, limit = 10, ...rest } = params || {};

      const { tracks, total } = await getTracks({ page, limit, ...rest });

      return {
        data: tracks,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
      throw new Error("Internal Server Error");
    }
  }

  @Mutation(() => Track)
  async addTrack(@Arg("input") input: CreateTrackInput): Promise<Track> {
    const { title, artist, album = "", genres = [], coverImage = "" } = input;

    if (!title || !artist) {
      throw new Error("Title and artist are required.");
    }

    if (!Array.isArray(genres)) {
      throw new Error("Genres must be an array.");
    }

    const slug = createSlug(title);

    const existing = await getTrackBySlug(slug);
    if (existing) {
      throw new Error("A track with this title already exists.");
    }

    const newTrack = await createTrack({
      title,
      artist,
      album,
      genres,
      coverImage,
      slug,
    });

    return newTrack;
  }

  @Mutation(() => Track)
  async updateTrack(
    @Arg("input") input: UpdateTrackInput
  ): Promise<Track> {
    const { id, ...data } = input;
    const existingTrack = await getTrackById(id);
    if (!existingTrack) {
      throw new Error("Track not found");
    }

    const updates: Partial<UpdateTrackInput & { slug?: string }> = { ...data };

    // Check if the title changed → update slug
    if (data.title && data.title !== existingTrack.title) {
      const newSlug = createSlug(data.title);
      const trackWithSameSlug = await getTrackBySlug(newSlug);
      if (trackWithSameSlug && trackWithSameSlug.id !== id) {
        throw new Error("A track with this title already exists");
      }
      updates.slug = newSlug;
    }

    const updatedTrack = await updateTrack(id, updates);
    if (!updatedTrack) {
      throw new Error("Failed to update track");
    }

    return updatedTrack;
  }

  @Mutation(() => Boolean)
  async deleteTrack(@Arg("id") id: string): Promise<boolean> {
    const success = await deleteTrack(id);
    if (!success) {
      throw new Error("Track not found");
    }
    return true;
  }

  @Mutation(() => BatchDeleteResponse)
  async deleteTracks(
    @Arg("ids", () => [String]) ids: string[]
  ): Promise<BatchDeleteResponse> {
    if (!ids || ids.length === 0) {
      throw new Error("Track IDs are required");
    }

    const result = await deleteMultipleTracks(ids);
    return result;
  }

  @Mutation(() => Track)
  async deleteTrackFile(@Arg("id") id: string): Promise<Track> {
    const existingTrack = await getTrackById(id);
    if (!existingTrack) {
      throw new Error("Track not found");
    }

    if (!existingTrack.audioFile) {
      throw new Error("Track has no audio file");
    }

    const success = await deleteAudioFile(id);
    if (!success) {
      throw new Error("Failed to delete audio file");
    }

    const updatedTrack = await getTrackById(id);
    if (!updatedTrack) {
      throw new Error("Failed to retrieve updated track");
    }

    return updatedTrack;
  }
}
