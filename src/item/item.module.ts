// src/item/item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Item])], // <-- เพิ่มตรงนี้
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
