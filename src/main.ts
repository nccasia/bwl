import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as dayjs from 'dayjs';
import * as cookieParser from 'cookie-parser';
import { Reaction } from './Reaction/reaction.schema';
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
const maxReaction = (emotion : Reaction[], opts) : Reaction[]=>{
  return emotion.length > 3 ? opts.fn(emotion.sort((a, b)=>b.count - a.count).filter((value, index)=>index < 3)) : opts.fn(emotion);
}

const feel = (post)=>{
  return post.totalLike + post.reactions.reduce((sumReaction, reaction)=>{
    return sumReaction + reaction.count;
  }, 0);
}
const maxPosts = (posts, opts) =>{
  //get posts if time posts < 1 weeks
   const maxPosts = posts.filter((posts)=> new Date((new Date().getTime()- new Date(+posts.createdTimestamp).getTime())).getDate()  <= 31)
  return maxPosts.length > 3 ? opts.fn(maxPosts.sort((a, b)=>feel(b)- feel(a)).filter((value, index)=>index < 9 )) : opts.fn(maxPosts);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  hbs.registerHelper('formatDay', formatDay);
  hbs.registerHelper('maxReaction', maxReaction);
  hbs.registerHelper('maxPosts', maxPosts);
  hbs.registerHelper('feel', feel);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
