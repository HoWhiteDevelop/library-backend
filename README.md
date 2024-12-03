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
git clone <repository-url>
cd library-management-system
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

- 开发者：[Your Name]
- 联系方式：[Your Email]

## License

[MIT licensed](LICENSE)
