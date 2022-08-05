import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import errorException from '../../common/errorException';
import { AlbumEntity } from './entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    return await this.albumService.create(createAlbumDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AlbumEntity> {
    const album = await this.albumService.findOne(id);
    if (!album) errorException.notFoundException('Album');
    return album;
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    return await this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.albumService.remove(id);
  }
}
