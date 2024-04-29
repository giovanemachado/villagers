import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  createSwaggerDocument,
  setupSwagger,
  updateSchemaFile,
} from './open-api/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const document = createSwaggerDocument(app);
  updateSchemaFile(document);
  setupSwagger(app, document);

  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get<string>('PORT') ?? 3000);
}

bootstrap();
