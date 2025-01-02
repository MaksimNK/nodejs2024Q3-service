export interface CreateTrackDto {
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export interface GetTrackDto {
  id: string;
  name: string;
  artistId: string;
  albumId: string | null;
  duration: number;
}

export interface UpdateTrackDto {
  name?: string;
  artistId?: string;
  albumId?: string | null;
  duration?: number;
}
