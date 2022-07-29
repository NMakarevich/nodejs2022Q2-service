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
import errorException from '../../common/errorException';
import { ArtistEntity } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createArtistDto: CreateArtistDto,
  ): Promise<ArtistEntity> {
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ArtistEntity[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ArtistEntity> {
    const artist = await this.artistService.findOne(id);
    if (!artist) errorException.notFoundException('Artist');
    return artist;
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.artistService.remove(id);
  }
}
