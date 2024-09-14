import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const apiDocConfig = new DocumentBuilder()
    .setTitle(process.env.APP_NAME)
    .build();
  const apiDoc = SwaggerModule.createDocument(app, apiDocConfig);
  SwaggerModule.setup('docs', app, apiDoc, {
    jsonDocumentUrl: 'docs/json',
  });

  await app.listen(process.env.PORT).then(() => {
    Logger.log(`API running on port ${process.env.PORT}`, 'AppBootstrap');
  });
}
bootstrap();
