import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as dayjs from 'dayjs';
import * as cookieParser from 'cookie-parser';

const formatDay = (time) => {
  return dayjs(new Date(+time.toString())).format('DD/MM/YYYY hh:mm A');
};
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  hbs.registerHelper('formatDay', formatDay);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
