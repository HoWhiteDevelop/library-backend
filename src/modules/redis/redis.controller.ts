import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Body,
} from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  /**
   * 测试Redis连接
   */
  @Get('test')
  async testConnection() {
    return this.redisService.testConnection();
  }

  /**
   * 获取所有缓存的键
   */
  @Get('keys')
  async getAllKeys() {
    return this.redisService.getAllKeys();
  }

  /**
   * 获取指定键的值
   */
  @Get('value/:key')
  async getValue(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    return {
      key,
      value: value ? value : null,
      type: typeof value,
    };
  }

  /**
   * 删除指定的键
   */
  @Delete('key/:key')
  async deleteKey(@Param('key') key: string) {
    await this.redisService.del(key);
    return { message: `Key ${key} has been deleted` };
  }

  /**
   * 获取Redis信息
   */
  @Get('info')
  async getRedisInfo() {
    return this.redisService.getRedisInfo();
  }

  /**
   * 设置键值对
   * @param key - 键名
   * @param data - 包含值和过期时间的对象
   */
  @Post('set/:key')
  async setValue(
    @Param('key') key: string,
    @Body() data: { value: string; expireSeconds?: number },
  ) {
    await this.redisService.set(key, data.value, data.expireSeconds);
    return {
      message: `Key ${key} has been set`,
      key,
      value: data.value,
      expireSeconds: data.expireSeconds || 'no expiration',
    };
  }

  /**
   * 批量设置键值对
   */
  @Post('batch-set')
  async setBatch(
    @Body()
    data: Array<{
      key: string;
      value: string;
      expireSeconds?: number;
    }>,
  ) {
    const results = await Promise.all(
      data.map(async (item) => {
        await this.redisService.set(item.key, item.value, item.expireSeconds);
        return {
          key: item.key,
          value: item.value,
          expireSeconds: item.expireSeconds || 'no expiration',
        };
      }),
    );

    return {
      message: `${results.length} keys have been set`,
      results,
    };
  }

  /**
   * 更新键的过期时间
   */
  @Put('expire/:key')
  async updateExpiry(
    @Param('key') key: string,
    @Body() data: { expireSeconds: number },
  ) {
    const exists = await this.redisService.exists(key);
    if (!exists) {
      return {
        message: `Key ${key} does not exist`,
        success: false,
      };
    }

    await this.redisService.expire(key, data.expireSeconds);
    return {
      message: `Expiry for key ${key} has been updated`,
      key,
      expireSeconds: data.expireSeconds,
      success: true,
    };
  }
}
