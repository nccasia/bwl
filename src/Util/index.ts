/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerOptions: MulterModuleOptions = {
    storage: diskStorage({
      destination: './images',
      filename: (req: any, file: any, callback: any) => {
        const newFileName = uuidv4() + extname(file.originalname);
        callback(null, newFileName);
      },
    }),
  };