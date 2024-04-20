import { Injectable } from '@nestjs/common';
import { MapData } from 'src/maps/types/map-data.type';
import { readFile, readdir } from 'fs/promises';

@Injectable()
export class DataAccessService {
  private readonly staticDataPath = 'static_data';

  async getStaticResource(folder: string, fileName: string): Promise<MapData> {
    return await this.readFile(`${folder}/${fileName}`);
  }

  private async readFile(file: string) {
    let fileData = JSON.parse(
      await readFile(`${this.staticDataPath}/${file}`, 'utf8'),
    );
    return fileData;
  }
}
