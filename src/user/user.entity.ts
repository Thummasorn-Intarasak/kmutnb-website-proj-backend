// src/user/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'user' }) // ระบุชื่อตารางให้ชัดเจน
@Unique(['username', 'email']) // กำหนดให้ username และ email ต้องไม่ซ้ำกัน
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  balance: number;
}
