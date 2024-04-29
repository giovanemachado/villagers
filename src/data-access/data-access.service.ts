import { Injectable } from '@nestjs/common';
import { MapData } from 'src/maps/dto/map-data.dto';
import { readFile } from 'fs/promises';

@Injectable()
export class DataAccessService {
  private readonly staticDataPath = 'static_data';

  async getStaticResource(folder: string, fileName: string): Promise<MapData> {
    return await this.readFile(`${folder}/${fileName}`);
  }

  private async readFile(file: string) {
    const fileData = JSON.parse(
      await readFile(`${this.staticDataPath}/${file}`, 'utf8'),
    );
    return fileData;
  }
}
