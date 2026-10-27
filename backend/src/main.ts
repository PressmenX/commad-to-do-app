import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { HttpErrorFilter } from './core/filters/http-error/http-error.filter';
import { TransformInterceptor } from './core/interceptors/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import type { Request, Response } from 'express';

async function createApp() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.init();

  return app;
}

let appPromise: ReturnType<typeof createApp> | undefined;

function getApp() {
  appPromise ??= createApp();
  return appPromise;
}

export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  app.getHttpAdapter().getInstance()(req, res);
}

async function bootstrap() {
  const app = await getApp();
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  await app.listen(configService.get('PORT') ?? 3000);
}

if (process.env.VERCEL !== '1') {
  void bootstrap();
}
