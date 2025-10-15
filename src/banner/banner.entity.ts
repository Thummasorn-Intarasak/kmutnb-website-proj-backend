import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'banner' })
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  buttonText: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  buttonColor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  titleColor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  backgroundColor: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
