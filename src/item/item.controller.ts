// src/item/item.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items') // กำหนด path หลักของ controller นี้เป็น /items
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get() // GET /items
  findAll() {
    return this.itemService.findAll();
  }

  @Get('search') // GET /items/search?name=game
  searchByName(@Query('name') name: string) {
    return this.itemService.searchByName(name);
  }

  @Get('price-range') // GET /items/price-range?min=100&max=500
  findByPriceRange(
    @Query('min') minPrice: string,
    @Query('max') maxPrice: string,
  ) {
    return this.itemService.findByPriceRange(+minPrice, +maxPrice);
  }

  @Get(':id') // GET /items/1
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Post() // POST /items
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Put(':id') // PUT /items/1
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id') // DELETE /items/1
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  // สร้าง Endpoint: PATCH /items/1/upload-image
  @Patch(':id/upload-image')
  @UseInterceptors(
    // ใช้ FileInterceptor เพื่อบอกว่า Endpoint นี้จะรับไฟล์
    // 'image' คือชื่อ field ที่เราจะส่งมาจาก Frontend (เช่น Postman)
    FileInterceptor('image', {
      storage: diskStorage({
        // กำหนดโฟลเดอร์ที่จะบันทึกไฟล์
        destination: './uploads/images',
        // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // จำกัดขนาดไฟล์ที่ 10MB
      },
      fileFilter: (req, file, callback) => {
        // อนุญาตเฉพาะไฟล์รูปภาพ
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File, // รับข้อมูลไฟล์ที่อัปโหลด
  ) {
    // ส่งแค่ "ชื่อไฟล์" ที่สร้างใหม่ไปให้ Service
    return this.itemService.updateItemImageURL(id, file.filename);
  }
}
