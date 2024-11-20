import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: AuthDTO) {
    try {
      this.authService.login(loginDto.login, loginDto.password);
    } catch (error) {}
  }
}
