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
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  // หา banner ตาม ID
  async findOne(id: number): Promise<Banner> {
    const banner = await this.bannerRepository.findOneBy({ id });
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }
    return banner;
  }

  // สร้าง banner ใหม่
  async create(createBannerDto: {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonColor?: string;
    titleColor?: string;
    backgroundColor?: string;
    isActive?: boolean;
    sortOrder?: number;
  }): Promise<Banner> {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  // อัปเดต banner
  async update(
    id: number,
    updateBannerDto: {
      title?: string;
      subtitle?: string;
      description?: string;
      image?: string;
      buttonText?: string;
      buttonColor?: string;
      titleColor?: string;
      backgroundColor?: string;
      isActive?: boolean;
      sortOrder?: number;
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

  // เปลี่ยนสถานะ banner
  async toggleActive(id: number): Promise<Banner> {
    const banner = await this.findOne(id);
    banner.isActive = !banner.isActive;
    return this.bannerRepository.save(banner);
  }
}
