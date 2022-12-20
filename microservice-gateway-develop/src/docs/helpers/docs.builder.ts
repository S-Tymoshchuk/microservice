import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import * as tags from '../tags';
import configuration from '@config/configuration';

function buildDocs(app: INestApplication) {
  const { swagger } = configuration();
  const documentBuilder = new DocumentBuilder()
    .addServer('/api')
    .setTitle(swagger.docsSwaggerTitle)
    .setDescription(swagger.docsSwaggerDescription)
    .setVersion(swagger.docsSwaggerVersion)
    .addBearerAuth();

  Object.values(tags).forEach((tag) => documentBuilder.addTag(tag));

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, documentBuilder.build(), {
      ignoreGlobalPrefix: true,
    }),
    { swaggerOptions: { persistAuthorization: true } },
  );
}

export { buildDocs };
