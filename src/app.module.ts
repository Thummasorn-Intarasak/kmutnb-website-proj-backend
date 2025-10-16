// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'belle',
      password: '123456',
      database: 'kmutnb-db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // ⚠️ เปลี่ยนเป็น false เพื่อป้องกันข้อมูลหาย!
      logging: false, // เพิ่มการ log SQL queries เพื่อ debug
    }),
    UserModule,
    ItemModule,
    BannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
