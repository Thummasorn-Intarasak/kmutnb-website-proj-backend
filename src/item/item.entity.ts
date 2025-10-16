import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'item' }) // บอกว่า Class นี้คือ Entity ของตารางที่ชื่อ 'item'
export class Item {
  @PrimaryGeneratedColumn() // บอกว่านี่คือ Primary Key และจะเพิ่มค่าอัตโนมัติ (เหมือน SERIAL)
  game_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false }) // คอลัมน์ธรรมดา
  game_name: string;

  @Column({ type: 'text', nullable: true })
  game_description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  game_price: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  game_image: string;
}
