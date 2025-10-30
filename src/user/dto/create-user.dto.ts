export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string; // optional, default จะเป็น 'user'
}
