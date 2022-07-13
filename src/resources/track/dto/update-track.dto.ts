import { PartialType } from '@nestjs/swagger';
import { CreateTrackDto } from './create-track.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string | null;

  @IsString()
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  @IsOptional()
  duration: number;
}
