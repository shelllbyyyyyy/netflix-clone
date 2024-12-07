import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  imports: [
    CloudinaryModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        cloud_name: configService.get<string>('CLOUDINARY_NAME'),
        api_key: configService.get<string>('CLOUDINARY_API_KEY'),
        api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CLoudinaryModules {}
