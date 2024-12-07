import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT认证守卫
 *
 * @description
 * 这是一个用于保护路由的认证守卫类，继承自 Passport 的 AuthGuard。
 * 当路由使用 @UseGuards(JwtAuthGuard) 装饰器时，会在访问该路由前进行 JWT token 的验证。
 *
 * @usage
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile() {
 *   // 只有携带有效的 JWT token 的请求才能访问此路由
 * }
 * ```
 *
 * @requires
 * - 需要配置 JWT 策略 (JwtStrategy)
 * - 需要在 AuthModule 中注册相关服务
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
