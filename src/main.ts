import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as dayjs from 'dayjs';
import * as cookieParser from 'cookie-parser';
var moment = require('moment');
const a = moment().format('MM DD YYYY, HH:mm:SS a');

const dayMoment = a.slice(3, 5);
const monthMoment = a.slice(0, 3);
const yearMoment = a.slice(6, 10);
const formatDay = (time) => {
  const day: any = dayjs(new Date(+time.toString())).format('DD');
  const month: any = dayjs(new Date(+time.toString())).format('MM');
  const year: any = dayjs(new Date(+time.toString())).format('YYYY');

  if (
    dayMoment - day == 0 &&
    monthMoment - month == 0 &&
    yearMoment - year == 0
  ) {
    return 'Today at ' + dayjs(new Date(+time.toString())).format('hh:mm A');
  } else if (
    dayMoment - day == 1 &&
    monthMoment - month == 0 &&
    yearMoment - year == 0
  ) {
    return (
      'Yesterday at ' + dayjs(new Date(+time.toString())).format('hh:mm A')
    );
  } else {
    return dayjs(+new Date(+time.toString())).format('DD/MM/YYYY hh:mm A');
  }
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
