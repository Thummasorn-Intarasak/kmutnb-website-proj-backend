import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // สร้างผู้ใช้ใหม่
  async create(createUserDto: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    const { username, email, password } = createUserDto;

    // ตรวจสอบว่ามี username หรือ email ซ้ำหรือไม่
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // หาผู้ใช้ตาม username
  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // หาผู้ใช้ตาม ID
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ตรวจสอบรหัสผ่าน
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // อัปเดตข้อมูลผู้ใช้
  async update(
    id: number,
    updateUserDto: {
      username?: string;
      email?: string;
      password?: string;
    },
  ): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  // ลบผู้ใช้
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
