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
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

  // สร้าง Endpoint: PATCH /items/1/upload-image (รูปเดียว)
  @Patch(':id/upload-image')
  @UseInterceptors(
    // ใช้ FileInterceptor เพื่อบอกว่า Endpoint นี้จะรับไฟล์
    // 'image' คือชื่อ field ที่เราจะส่งมาจาก Frontend (เช่น Postman)
    FileInterceptor('image', {
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
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File, // รับข้อมูลไฟล์ที่อัปโหลด
  ) {
    // ส่งไฟล์ไปให้ Service จัดการ
    return this.itemService.updateItemImageURL(id, file);
  }

  // สร้าง Endpoint: PATCH /items/1/upload-images (หลายรูป)
  @Patch(':id/upload-images')
  @UseInterceptors(
    // ใช้ FilesInterceptor เพื่อรับหลายไฟล์
    // 'images' คือชื่อ field ที่เราจะส่งมาจาก Postman
    FilesInterceptor('images', 10, {
      // รับได้สูงสุด 10 รูป
      limits: {
        fileSize: 10 * 1024 * 1024, // จำกัดขนาดไฟล์ที่ 10MB ต่อรูป
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[], // รับข้อมูลไฟล์หลายไฟล์
  ) {
    // ตรวจสอบว่ามีไฟล์ส่งมาหรือไม่
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    console.log(
      `Received ${files.length} files:`,
      files.map((f) => f.originalname),
    );

    // ส่งไฟล์ทั้งหมดไปให้ Service จัดการ
    return this.itemService.updateItemMultipleImages(id, files);
  }
}
