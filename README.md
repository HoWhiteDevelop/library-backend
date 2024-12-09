# 图书馆管理系统后端

基于 NestJS 框架开发的图书馆管理系统后端服务，集成了 MySQL、Redis 和 Elasticsearch，提供完整的图书管理、用户认证、借阅管理等功能。

## 功能特性

- 用户认证与权限管理

  - JWT 认证
  - 角色权限控制（管理员/读者）
  - 用户注册和登录

- 图书管理

  - 图书 CRUD 操作
  - ISBN 查询
  - 高级搜索（基于 Elasticsearch）
  - 图书状态管理

- 借阅管理

  - 图书借阅
  - 图书归还
  - 借阅历史记录
  - 自动上架功能

- 缓存管理

  - Redis 缓存集成
  - 热点数据缓存
  - 缓存自动过期

- 全文搜索
  - Elasticsearch 集成
  - 多字段搜索
  - 模糊匹配
  - 相关度排序

## 技术栈

- NestJS
- TypeORM
- MySQL
- Redis
- Elasticsearch
- JWT
- Swagger

## 环境要求

- Node.js >= 16
- MySQL >= 8.0
- Redis >= 6.0
- Elasticsearch >= 8.0

## 安装部署

1. 克隆项目

```bash
git clone https://github.com/HoWhiteDevelop/library-backend.git
cd library-backend
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 修改环境变量配置
vim .env
```

4. 初始化数据库

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE library;

# 运行迁移
pnpm run typeorm migration:run
```

5. 启动服务

```bash
# 开发环境
pnpm run start:dev

# 生产环境
pnpm run build
pnpm run start:prod
```

## API 文档

启动服务后访问 Swagger 文档：

```
http://localhost:3000/api
```

## 主要接口

- 认证相关

  - POST /auth/login - 用户登录
  - POST /auth/register - 用户注册

- 图书管理

  - GET /books - 获取图书列表
  - GET /books/search - 高级搜索
  - GET /books/:isbn - 通过 ISBN 查询
  - POST /books - 添加图书
  - PUT /books/:id - 更新图书
  - DELETE /books/:id - 删除图书

- 借阅管理
  - POST /books/borrow - 借阅图书
  - POST /books/return - 归还图书
  - GET /books/loans - 借阅记录

## 缓存管理

- Redis 缓存接口
  - GET /redis/test - 测试连接
  - GET /redis/keys - 查看所有键
  - GET /redis/value/:key - 获取指定键值
  - DELETE /redis/key/:key - 删除缓存

## 搜索功能

- Elasticsearch 接口
  - GET /elasticsearch/test - 测试连接
  - POST /elasticsearch/init-index - 初始化索引
  - POST /elasticsearch/reindex - 重建索引
  - GET /elasticsearch/index-info - 获取索引信息

## 开发团队

- 开发者：HoWhite
- 联系方式：howhite1023@gmail.com

## License

[MIT licensed](LICENSE)

## 完整文件结构说明

```
src/
├── main.ts                     # 应用程序入口文件
│   - 配置全局中间件
│   - 配置 Swagger 文档
│   - 启动应用程序
│   - 配置全局异常过滤器
│
├── modules/
│   ├── books/                 # 图书管理模块
│   │   ├── books.service.ts   # 图书服务
│   │   │   - 图书 CRUD 操作
│   │   │   - 图书信息查询
│   │   │   - 库存管理
│   │   │   - 图书状态更新
│   │   │
│   │   ├── books.module.ts    # 图书模块配置
│   │   │   - 导入依赖模块
│   │   │   - 配置服务提供者
│   │   │   - 导出模块接口
│   │   │
│   │   ├── books.controller.ts # 图书控制器
│   │   │   - 处理图书相关请求
│   │   │   - 路由配置
│   │   │   - 参数验证
│   │   │   - 权限控制
│   │   │
│   │   └── book-loan.service.ts # 借阅服务
│   │       - 借书业务逻辑
│   │       - 还书业务逻辑
│   │       - 借阅历史管理
│   │       - 逾期处理
│   │
│   └── auth/                  # 认证模块
│       ├── local.strategy.ts  # 本地认证策略
│       │   - 用户名密码验证
│       │   - 用户信息验证
│       │   - 登录逻辑处理
│       │
│       ├── local-auth.guard.ts # 本地认证守卫
│       │   - 登录接口保护
│       │   - 认证信息验证
│       │   - 会话管理
│       │
│       ├── jwt.strategy.ts    # JWT认证策略
│       │   - Token 验证
│       │   - Token 解析
│       │   - 用户信息提取
│       │   - 权限验证
│       │
│       └── jwt-auth.guard.ts  # JWT认证守卫
│           - API 接口保护
│           - Token 有效性验证
│           - 权限检查
│           - 请求拦截
```

### 详细功能说明

#### 入口文件 (main.ts)

- 应用程序引导和初始化
- 全局配置设置
- 中间件注册
- 异常处理配置
- 文档系统配置
- 服务器启动配置

#### Books 模块详解

**books.service.ts**

- 图书信息的增删改查
- ISBN 编号管理
- 库存数量追踪
- 图书分类管理
- 图书状态监控
- 搜索功能实现

**books.module.ts**

- 模块依赖配置
- 服务注册
- 数据库连接配置
- 缓存配置
- 搜索引擎集成

**books.controller.ts**

- RESTful API 实现
- 请求参数验证
- 响应数据格式化
- 权限检查
- 异常处理
- 日志记录

**book-loan.service.ts**

- 借阅规则实现
- 借阅状态管理
- 借阅历史记录
- 逾期处理
- 自动提醒功能
- 黑名单管理

#### Auth 模块详解

**local.strategy.ts**

- 本地认证逻辑
- 密码加密处理
- 用户验证流程
- 登录尝试限制
- 安全策略实现

**local-auth.guard.ts**

- 登录保护
- 会话管理
- 认证信息验证
- 登录状态维护
- 安全拦截

**jwt.strategy.ts**

- JWT 令牌生成
- 令牌验证逻辑
- 用户信息加密
- 令牌刷新机制
- 安全策略实现

**jwt-auth.guard.ts**

- API 访问控制
- 令牌有效性检查
- 权限级别验证
- 请求过滤
- 安全拦截器
