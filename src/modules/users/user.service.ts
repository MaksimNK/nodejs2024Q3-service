import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { CreateUserDto, GetUserDto, UpdatePasswordDto } from './dto/user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private users: Map<string, UserEntity> = new Map();

  createUser(createUserDto: CreateUserDto): UserEntity {
    const { login, password } = createUserDto;
    const user: UserEntity = {
      id: randomUUID(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.set(user.id, user);
    return user;
  }

  getAllUsers(): GetUserDto[] {
    return Array.from(this.users.values()).map((user) => ({
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  getUserById(userId: string): GetUserDto | null {
    const user = this.users.get(userId);
    if (!user) return null;
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  updateUserPassword(
    updatePasswordDto: UpdatePasswordDto,
    userId: string,
  ): boolean {
    if (!this.isUserExist(userId)) {
      throw new Error('User does not exist');
    }
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = this.users.get(userId);
    if (user.password !== oldPassword) {
      throw new Error('Old password is incorrect');
    }
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return true;
  }

  deleteUser(userId: string): boolean {
    this.users.delete(userId);
    return true;
  }

  isUserExist(userId: string): boolean {
    return this.users.has(userId);
  }

  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }
}
