import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GetUserDto, CreateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): GetUserDto[] {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string): GetUserDto {
    if (!this.userService.isValidUUID(id)) {
      throw new HttpException('Invalid userId format', HttpStatus.BAD_REQUEST);
    }
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): UserEntity {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new HttpException(
        'Request body must contain login and password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): boolean {
    if (!this.userService.isValidUUID(id)) {
      throw new HttpException('Invalid userId format', HttpStatus.BAD_REQUEST);
    }
    const { oldPassword, newPassword } = updatePasswordDto;
    if (!oldPassword || !newPassword) {
      throw new HttpException(
        'Request body must contain oldPassword and newPassword',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return this.userService.updateUserPassword(updatePasswordDto, id);
    } catch (error) {
      if (error.message === 'User does not exist') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message === 'Old password is incorrect') {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw error;
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    if (!this.userService.isValidUUID(id)) {
      throw new HttpException('Invalid userId format', HttpStatus.BAD_REQUEST);
    }
    if (!this.userService.isUserExist(id)) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.userService.deleteUser(id);
    return { statusCode: HttpStatus.NO_CONTENT };
  }
}
