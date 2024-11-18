import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { CreateUserDto, GetUserDto, UpdatePasswordDto } from './dto/user.dto';
import { randomUUID } from 'crypto';
import { plainToClass } from 'class-transformer';
import { DbService } from 'src/db.service';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.dbService.user.create({
      data: createUserDto,
    });

    return plainToClass(UserEntity, newUser);
  }

  async getAllUsers() {
    const users = await this.dbService.user.findMany();
    return users.map((user) => plainToClass(UserEntity, user));
  }

  async getUserById(id: string) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }

    const user = await this.dbService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }

    return user;
  }

  async updateUserPassword(updatePasswordDto: UpdatePasswordDto, id: string) {
    const user = await this.getUserById(id);
    if (user) {
      const userStoredPassword = user.password;

      if (updatePasswordDto.oldPassword !== userStoredPassword) {
        throw new ForbiddenException('Wrong old password');
      }

      const updatedUser = this.dbService.user.update({
        where: { id },
        data: {
          password: updatePasswordDto.newPassword,
          version: user.version + 1,
        },
      });

      return plainToClass(UserEntity, updatedUser);
    }
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    if (user) {
      await this.dbService.user.delete({
        where: { id },
      });
    }
  }
  isValidUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    );
  }
}
