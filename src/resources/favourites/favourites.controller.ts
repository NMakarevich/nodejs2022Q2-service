import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavouritesService } from './favourites.service';

@Controller('favs/')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    return await this.favouritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.favouritesService.addTrack(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return await this.favouritesService.addArtist(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.favouritesService.addAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favouritesService.removeArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favouritesService.removeAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.favouritesService.removeTrack(id);
  }
}
