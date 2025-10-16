import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Item } from '../item/item.entity';

@Entity({ name: 'banner' })
export class Banner {
  @PrimaryGeneratedColumn()
  banner_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  banner_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  banner_image: string;

  @Column({ type: 'int', nullable: false })
  game_id: number;

  @ManyToOne(() => Item, { eager: true })
  @JoinColumn({ name: 'game_id' })
  game: Item;
}
