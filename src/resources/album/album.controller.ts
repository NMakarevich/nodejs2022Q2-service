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
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumModel } from './models/album.model';
import { NOT_FOUND_MESSAGE } from '../../consts/consts';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createAlbumDto: CreateAlbumDto): AlbumModel {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @HttpCode(200)
  findAll(): AlbumModel[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): AlbumModel {
    const album = this.albumService.findOne(id);
    if (!album)
      throw new HttpException(
        `Album ${NOT_FOUND_MESSAGE}`,
        HttpStatus.NOT_FOUND,
      );
    return album;
  }

  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.albumService.remove(id);
  }
}
