export interface CreateAlbumDto {
  name: string;
  year: number;
  artistId: string | null;
}

export interface UpdateAlbumDto {
  name: string;
  year: number;
  artistId: string | null;
}

export interface GetAlbumDto {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}
