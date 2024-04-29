import { INestApplication } from '@nestjs/common';
import {
  SwaggerDocumentOptions,
  DocumentBuilder,
  SwaggerModule,
  OpenAPIObject,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yaml';

export const createSwaggerDocument = (
  app: INestApplication<any>,
): OpenAPIObject => {
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const config = new DocumentBuilder()
    .setTitle('Villagers')
    .setDescription('Villagers is the backend for Castle Age.')
    .build();

  return SwaggerModule.createDocument(app, config, options);
};

export const setupSwagger = (
  app: INestApplication<any>,
  document: OpenAPIObject,
) => {
  SwaggerModule.setup('api', app, document);
};

export const updateSchemaFile = (document: OpenAPIObject) => {
  const yamlString: string = yaml.stringify(document, {});
  fs.writeFileSync('./src/open-api/schema.yaml', yamlString);
};
