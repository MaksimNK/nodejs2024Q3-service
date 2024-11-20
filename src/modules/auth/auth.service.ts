import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from 'src/db.service';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DbService) {}
  async login(login: string, password: string) {
    const user = await this.dbService.user.findUnique({
      where: { login: login },
    });
    if (user.password === password) {
      return;
    } else {
      throw new BadRequestException('Wrong Passwrod');
    }
  }
}
