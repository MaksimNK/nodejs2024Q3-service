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
  HttpCode,
} from '@nestjs/common';
import { GetUserDto, CreateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
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
  ) {
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
      const updatedUser = this.userService.updateUserPassword(
        updatePasswordDto,
        id,
      );
      return updatedUser;
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
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!this.userService.isValidUUID(id)) {
      throw new HttpException('Invalid userId format', HttpStatus.BAD_REQUEST);
    }

    this.userService.deleteUser(id);
    return { statusCode: HttpStatus.NO_CONTENT };
  }
}
