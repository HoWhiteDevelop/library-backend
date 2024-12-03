import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('正在验证用户:', username);
    const user = await this.usersService.findOne(username);
    console.log('查找到的用户:', user);

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('密码验证成功');
      const { password, ...result } = user;
      return result;
    }
    console.log('验证失败');
    return null;
  }

  async login(user: any) {
    console.log(user);
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
