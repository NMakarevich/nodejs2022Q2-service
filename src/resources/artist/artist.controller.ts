import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistModel } from './models/artist.model';
import errorException from '../../common/errorException';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createArtistDto: CreateArtistDto): ArtistModel {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @HttpCode(200)
  findAll(): ArtistModel[] {
    return this.artistService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): ArtistModel {
    const artist = this.artistService.findOne(id);
    if (!artist) errorException.notFoundException('Artist');
    return artist;
  }

  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): ArtistModel {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.artistService.remove(id);
  }
}
