import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  // ดึงข้อมูล banner ทั้งหมด
  async findAll(): Promise<Banner[]> {
    return this.bannerRepository.find({
      relations: ['game'],
      order: { banner_id: 'ASC' },
    });
  }

  // หา banner ตาม ID
  async findOne(id: number): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({
      where: { banner_id: id },
      relations: ['game'],
    });
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }
    return banner;
  }

  // สร้าง banner ใหม่
  async create(createBannerDto: {
    banner_name: string;
    banner_image?: string;
    game_id: number;
  }): Promise<Banner> {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  // อัปเดต banner
  async update(
    id: number,
    updateBannerDto: {
      banner_name?: string;
      banner_image?: string;
      game_id?: number;
    },
  ): Promise<Banner> {
    const banner = await this.findOne(id);
    Object.assign(banner, updateBannerDto);
    return this.bannerRepository.save(banner);
  }

  // ลบ banner
  async remove(id: number): Promise<void> {
    const banner = await this.findOne(id);
    await this.bannerRepository.remove(banner);
  }

  // อัปเดต URL รูปภาพของ banner
  async updateBannerImageURL(id: number, filename: string): Promise<Banner> {
    const banner = await this.bannerRepository.findOneBy({ banner_id: id });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    // สร้าง path สำหรับรูป
    const imagePath = `uploads/banners/${filename}`;

    // นำ path ไปอัปเดตในคอลัมน์ banner_image
    banner.banner_image = imagePath;

    // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
    return this.bannerRepository.save(banner);
  }
}
