import { IsOptional } from 'class-validator';

export class CreateFavouriteDto {
  @IsOptional()
  artists: string[];

  @IsOptional()
  albums: string[];

  @IsOptional()
  tracks: string[];
}
