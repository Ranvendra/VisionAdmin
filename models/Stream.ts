import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStream extends Document {
  tmdbId: string;
  name: string;
  type: 'movie' | 'series';
  isAdult: boolean;
  url: string;
  seasonNumber?: number | null;
  episodeNumber?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const StreamSchema = new Schema<IStream>(
  {
    tmdbId: {
      type: String,
      required: [true, 'TMDb ID is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Content Name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['movie', 'series'],
        message: '{VALUE} is not a valid content type',
      },
      required: [true, 'Content Type is required'],
    },
    isAdult: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: [true, 'Stream URL is required'],
      trim: true,
    },
    seasonNumber: {
      type: Number,
      default: null,
      required: function (this: IStream) {
        return this.type === 'series';
      },
    },
    episodeNumber: {
      type: Number,
      default: null,
      required: function (this: IStream) {
        return this.type === 'series';
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create unique compound index on { tmdbId, type, seasonNumber, episodeNumber }
StreamSchema.index(
  { tmdbId: 1, type: 1, seasonNumber: 1, episodeNumber: 1 },
  { unique: true }
);

const Stream: Model<IStream> =
  mongoose.models.Stream || mongoose.model<IStream>('Stream', StreamSchema);

export default Stream;
