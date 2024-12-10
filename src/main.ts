import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局管道，用于验证请求数据
  app.useGlobalPipes(new ValidationPipe());

  // 启用 CORS
  app.enableCors({
    origin: '*', // 允许所有来源访问
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // 允许发送认证信息（cookies等）
    allowedHeaders: '*',
    exposedHeaders: 'Authorization',
  });

  // Swagger API文档配置
  const config = new DocumentBuilder()
    .setTitle('图书馆管理系统')
    .setDescription('图书馆管理系统API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
  });
}
bootstrap();
