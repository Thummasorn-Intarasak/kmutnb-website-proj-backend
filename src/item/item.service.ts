// src/item/item.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>, // <-- ฉีด Repository เข้ามา
  ) {}

  // เมธอดสำหรับดึงข้อมูลเกมทั้งหมด
  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  // เมธอดสำหรับหาเกมตาม id
  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id: id });
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }

  // สร้างเกมใหม่
  async create(createItemDto: {
    game_name: string;
    description?: string;
    price: number;
    game_image?: string;
  }): Promise<Item> {
    const item = this.itemRepository.create(createItemDto);
    return this.itemRepository.save(item);
  }

  // อัปเดตเกม
  async update(
    id: number,
    updateItemDto: {
      game_name?: string;
      description?: string;
      price?: number;
      game_image?: string;
    },
  ): Promise<Item> {
    const item = await this.findOne(id);
    Object.assign(item, updateItemDto);
    return this.itemRepository.save(item);
  }

  // ลบเกม
  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
  }

  // ค้นหาเกมตามชื่อ
  async searchByName(name: string): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.game_name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  // ค้นหาเกมตามช่วงราคา
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .getMany();
  }

  // อัปเดต URL รูปภาพของเกม
  async updateItemImageURL(id: number, filename: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // สร้าง path สำหรับรูป
    const imagePath = `uploads/images/${filename}`;

    // นำ path ไปอัปเดตในคอลัมน์ game_image
    item.game_image = imagePath;

    // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
    return this.itemRepository.save(item);
  }
}
