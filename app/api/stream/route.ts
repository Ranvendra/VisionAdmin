import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Stream from '@/models/Stream';

// GET: Retrieve the last 5 upserted stream links
export async function GET() {
  try {
    await connectDB();
    const streams = await Stream.find().sort({ updatedAt: -1 }).limit(5);
    return NextResponse.json({
      success: true,
      streams,
    });
  } catch (error: any) {
    console.error('API GET Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch recently saved streams.',
      },
      { status: 500 }
    );
  }
}

// POST: Upsert a stream link safely in one atomic query
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tmdbId, name, type, isAdult, url, seasonNumber, episodeNumber } = body;

    // 1. Inputs Validation
    if (!tmdbId || typeof tmdbId !== 'string' || !tmdbId.trim()) {
      return NextResponse.json(
        { success: false, error: 'TMDb ID is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content Name is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    if (!type || (type !== 'movie' && type !== 'series')) {
      return NextResponse.json(
        { success: false, error: "Content Type must be either 'movie' or 'series'." },
        { status: 400 }
      );
    }

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { success: false, error: 'Stream URL is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url.trim());
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Stream URL is invalid. Please enter a valid URL starting with http:// or https://.',
        },
        { status: 400 }
      );
    }

    let parsedSeason: number | null = null;
    let parsedEpisode: number | null = null;

    if (type === 'series') {
      if (seasonNumber === undefined || seasonNumber === null || seasonNumber === '') {
        return NextResponse.json(
          { success: false, error: 'Season Number is required for TV series.' },
          { status: 400 }
        );
      }
      if (episodeNumber === undefined || episodeNumber === null || episodeNumber === '') {
        return NextResponse.json(
          { success: false, error: 'Episode Number is required for TV series.' },
          { status: 400 }
        );
      }

      parsedSeason = Number(seasonNumber);
      parsedEpisode = Number(episodeNumber);

      if (isNaN(parsedSeason) || parsedSeason < 1 || !Number.isInteger(parsedSeason)) {
        return NextResponse.json(
          { success: false, error: 'Season Number must be a valid positive integer.' },
          { status: 400 }
        );
      }

      if (isNaN(parsedEpisode) || parsedEpisode < 1 || !Number.isInteger(parsedEpisode)) {
        return NextResponse.json(
          { success: false, error: 'Episode Number must be a valid positive integer.' },
          { status: 400 }
        );
      }
    }

    // 2. Connect to the Database
    await connectDB();

    // 3. Upsert Logic
    const filter: any = {};
    const updateData: any = {
      tmdbId: tmdbId.trim(),
      name: name.trim(),
      type,
      isAdult: Boolean(isAdult),
      url: url.trim(),
    };

    if (type === 'movie') {
      filter.tmdbId = tmdbId.trim();
      filter.type = 'movie';
      updateData.seasonNumber = null;
      updateData.episodeNumber = null;
    } else {
      filter.tmdbId = tmdbId.trim();
      filter.type = 'series';
      filter.seasonNumber = parsedSeason;
      filter.episodeNumber = parsedEpisode;
      updateData.seasonNumber = parsedSeason;
      updateData.episodeNumber = parsedEpisode;
    }

    // Clean atomic upsert
    const savedStream = await Stream.findOneAndUpdate(
      filter,
      { $set: updateData },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message:
        type === 'movie'
          ? `Successfully saved movie link for "${name.trim()}" (TMDb ID: ${tmdbId.trim()})`
          : `Successfully saved series link for "${name.trim()}" (TMDb ID: ${tmdbId.trim()}) — S${parsedSeason}E${parsedEpisode}`,
      stream: savedStream,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while saving the stream.',
      },
      { status: 500 }
    );
  }
}
