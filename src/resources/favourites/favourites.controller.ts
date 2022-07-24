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
import { FavouritesResponseModel } from './models/favourites.model';

@Controller('favs/')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  @HttpCode(200)
  findAll(): Promise<FavouritesResponseModel> {
    return this.favouritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favouritesService.addTrack(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favouritesService.addArtist(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favouritesService.addAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.favouritesService.removeArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.favouritesService.removeAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.favouritesService.removeTrack(id);
  }
}
