import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UsersService } from '../modules/users/users.service';

async function updatePasswords() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    console.log('开始更新用户密码...');
    const users = await usersService.findAll();
    console.log(`找到 ${users.length} 个用户需要更新密码`);

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await usersService.updatePassword(user.id, hashedPassword);
      console.log(`用户 ${user.username} 的密码已更新`);
    }

    console.log('所有密码更新完成');
    await app.close();
  } catch (error) {
    console.error('更新密码时出错:', error);
    process.exit(1);
  }
}

updatePasswords();
