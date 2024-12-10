import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookiParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookiParser());
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('perago')
    .setDescription('API for managing reports')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
