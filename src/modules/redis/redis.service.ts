import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, seconds?: number): Promise<void> {
    if (seconds) {
      await this.redis.setex(key, seconds, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * 测试Redis连接
   * @returns 连接状态信息
   */
  async testConnection(): Promise<{ status: string; message: string }> {
    try {
      await this.redis.ping();
      return {
        status: 'connected',
        message: 'Redis connection is working',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  /**
   * 获取所有键
   */
  async getAllKeys(): Promise<string[]> {
    return this.redis.keys('*');
  }

  /**
   * 获取Redis服务器信息
   */
  async getRedisInfo(): Promise<any> {
    const info = await this.redis.info();
    const keyspace = await this.redis.info('keyspace');
    const memory = await this.redis.info('memory');

    return {
      info: this.parseRedisInfo(info),
      keyspace: this.parseRedisInfo(keyspace),
      memory: this.parseRedisInfo(memory),
      keys: await this.getAllKeys(),
    };
  }

  /**
   * 解析Redis INFO命令返回的字符串
   */
  private parseRedisInfo(info: string): any {
    const lines = info.split('\n');
    const result = {};

    lines.forEach((line) => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          result[key.trim()] = value.trim();
        }
      }
    });

    return result;
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  /**
   * 设置键的过期时间
   */
  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }
}
