import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // ดึงข้อมูล banner ทั้งหมด
  @Get()
  async findAll() {
    return this.bannerService.findAll();
  }

  // ดึงข้อมูล banner ตาม ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  // สร้าง banner ใหม่
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  // อัปเดต banner
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannerService.update(+id, updateBannerDto);
  }

  // ลบ banner
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }

  // อัปโหลดรูปภาพ banner
  @Patch(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('banner_image', {
      storage: diskStorage({
        destination: './uploads/banners',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `banner-${uniqueSuffix}${ext}`;
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
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bannerService.updateBannerImageURL(id, file.filename);
  }
}
