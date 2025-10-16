// src/item/item.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>, // <-- ฉีด Repository เข้ามา
  ) {}

  // สร้าง slug จากชื่อเกม (แปลงเป็นตัวพิมพ์เล็ก และแทนที่ช่องว่างด้วย dash)
  private createGameSlug(gameName: string): string {
    return gameName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // ลบอักขระพิเศษ
      .replace(/\s+/g, '-') // แทนที่ช่องว่างด้วย dash
      .replace(/-+/g, '-') // แทนที่ dash ซ้ำกันด้วย dash เดียว
      .trim();
  }

  // สร้าง folder ถ้ายังไม่มี
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // เมธอดสำหรับดึงข้อมูลเกมทั้งหมด
  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  // เมธอดสำหรับหาเกมตาม id
  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ game_id: id });
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }

  // สร้างเกมใหม่
  async create(createItemDto: {
    game_name: string;
    game_description?: string;
    game_price: number;
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
      game_description?: string;
      game_price?: number;
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
      .where('item.game_price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .getMany();
  }

  // อัปเดต URL รูปภาพของเกม (รูปเดียว)
  async updateItemImageURL(
    id: number,
    file: Express.Multer.File,
  ): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ game_id: id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // สร้าง slug จากชื่อเกม
    const gameSlug = this.createGameSlug(item.game_name);

    // สร้าง path สำหรับ folder ของเกม
    const gameFolderPath = path.join('./uploads/games', gameSlug);

    // สร้าง folder ถ้ายังไม่มี
    this.ensureDirectoryExists(gameFolderPath);

    // สร้างชื่อไฟล์ใหม่
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `game-${uniqueSuffix}${ext}`;

    // บันทึกไฟล์
    const filePath = path.join(gameFolderPath, filename);
    fs.writeFileSync(filePath, file.buffer);

    // สร้าง path สำหรับเก็บในฐานข้อมูล
    const imagePath = `uploads/games/${gameSlug}/${filename}`;

    // นำ path ไปอัปเดตในคอลัมน์ game_image
    item.game_image = imagePath;

    // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
    return this.itemRepository.save(item);
  }

  // อัปเดตหลายรูปภาพของเกม (เก็บเป็น JSON string)
  async updateItemMultipleImages(
    id: number,
    files: Express.Multer.File[],
  ): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ game_id: id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // สร้าง slug จากชื่อเกม
    const gameSlug = this.createGameSlug(item.game_name);

    // สร้าง path สำหรับ folder ของเกม
    const gameFolderPath = path.join('./uploads/games', gameSlug);

    // สร้าง folder ถ้ายังไม่มี
    this.ensureDirectoryExists(gameFolderPath);

    // บันทึกไฟล์ทั้งหมดและเก็บ paths
    const imagePaths: string[] = [];

    for (const file of files) {
      // สร้างชื่อไฟล์ใหม่
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = `game-${uniqueSuffix}${ext}`;

      // บันทึกไฟล์
      const filePath = path.join(gameFolderPath, filename);
      fs.writeFileSync(filePath, file.buffer);

      // เก็บ path
      imagePaths.push(`uploads/games/${gameSlug}/${filename}`);
    }

    // เก็บเป็น JSON string ในคอลัมน์ game_image
    item.game_image = JSON.stringify(imagePaths);

    // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
    return this.itemRepository.save(item);
  }
}
