import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // สร้างผู้ใช้ใหม่ (Register)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    // ไม่ส่งรหัสผ่านกลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return {
      message: 'User created successfully',
      user: result,
    };
  }

  // เข้าสู่ระบบ (Login)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { username: string; password: string }) {
    const { username, password } = loginDto;

    try {
      console.log('Login attempt for username:', username);
      const user = await this.userService.findByUsername(username);
      console.log('User found:', user ? 'Yes' : 'No');

      const isPasswordValid = await this.userService.validatePassword(
        password,
        user.password,
      );
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid username or password');
      }

      // ไม่ส่งรหัสผ่านกลับไป
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return {
        message: 'Login successful',
        user: result,
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid username or password');
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    // ไม่ส่งรหัสผ่านกลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password: _, ...user }) => user);
  }

  // ดึงข้อมูลผู้ใช้ตาม ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(+id);
    // ไม่ส่งรหัสผ่านกลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  // อัปเดตข้อมูลผู้ใช้
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);
    // ไม่ส่งรหัสผ่านกลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return {
      message: 'User updated successfully',
      user: result,
    };
  }

  // ลบผู้ใช้
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return {
      message: 'User deleted successfully',
    };
  }

  // Reset password (สำหรับ development/testing เท่านั้น)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetDto: { username: string; newPassword: string },
  ) {
    const { username, newPassword } = resetDto;

    try {
      const user = await this.userService.findByUsername(username);
      await this.userService.update(user.id, { password: newPassword });

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
