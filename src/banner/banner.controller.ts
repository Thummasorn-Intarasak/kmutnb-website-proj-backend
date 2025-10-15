import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
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
  async update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(+id, updateBannerDto);
  }

  // ลบ banner
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }

  // เปลี่ยนสถานะ banner
  @Put(':id/toggle')
  async toggleActive(@Param('id') id: string) {
    return this.bannerService.toggleActive(+id);
  }
}
