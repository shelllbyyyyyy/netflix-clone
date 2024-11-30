import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const exceptions = new HttpExceptionFilter();

  const config = new DocumentBuilder()
    .setTitle('CLONE NETFLIX API')
    .setDescription('API for my custom netflix')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalFilters(exceptions);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
