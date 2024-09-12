import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT).then(() => {
    Logger.log(`API running on port ${process.env.PORT}`, 'AppBootstrap');
  });
}
bootstrap();
