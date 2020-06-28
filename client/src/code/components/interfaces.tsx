interface ISpotifyImagesObject {
  url: string;
}

interface ISpotifyArtistsObject {
  name: string;
}

export interface ITrack {
  id: string;
  name: string;
  artist: string;
  imageId: string;
  explicit: boolean;
  durationInMs: number;
}

export interface IRequest {
  rank: number;
  requestedBy: string;
  upvotedBy: string[];
  downvotedBy: string[];
  track: ITrack;
}

export interface ISpotifyTrack {
  id: string;
  name: string;
  album: {
    images: ISpotifyImagesObject[];
  };
  artists: ISpotifyArtistsObject[];
  explicit: boolean;
  duration_ms: number;
}
