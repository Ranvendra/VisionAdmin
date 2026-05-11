import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieRequest extends Document {
  userId: mongoose.Types.ObjectId;
  tmdbId: string;
  title: string;
  posterPath?: string;
  mediaType: 'movie' | 'tv';
  status: 'pending' | 'fulfilled';
  createdAt: Date;
  updatedAt: Date;
}

const MovieRequestSchema = new Schema<IMovieRequest>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    tmdbId: { 
      type: String, 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    posterPath: { 
      type: String 
    },
    mediaType: { 
      type: String, 
      enum: ['movie', 'tv'], 
      required: true 
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled'],
      default: 'pending'
    }
  },
  { 
    timestamps: true 
  }
);

// Optimize querying for lists sorted by recent
MovieRequestSchema.index({ createdAt: -1 });

const MovieRequest: Model<IMovieRequest> =
  mongoose.models.MovieRequest || mongoose.model<IMovieRequest>('MovieRequest', MovieRequestSchema);

export default MovieRequest;
