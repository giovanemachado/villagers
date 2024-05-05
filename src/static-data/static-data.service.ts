import { Injectable } from '@nestjs/common';
import { GeneratedMap } from 'src/maps/dto/map-data.dto';
import { readFile } from 'fs/promises';

@Injectable()
export class StaticDataService {
  private readonly staticDataPath = 'src/static_data';

  async getStaticResource(
    folder: string,
    fileName: string,
  ): Promise<GeneratedMap> {
    return await this.readFile(`${folder}/${fileName}`);
  }

  private async readFile(file: string) {
    const fileData = JSON.parse(
      await readFile(`${this.staticDataPath}/${file}`, 'utf8'),
    );
    return fileData;
  }
}
