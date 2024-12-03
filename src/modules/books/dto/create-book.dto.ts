import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: '深入理解计算机系统', description: '图书标题' })
  title: string;

  @ApiProperty({ example: 'Randal E. Bryant', description: '作者名称' })
  author: string;

  @ApiProperty({
    example: '9787111544937',
    description: 'ISBN号',
    minLength: 10,
    maxLength: 13,
  })
  isbn: string;

  @ApiProperty({
    example: 139.0,
    description: '图书价格',
    minimum: 0,
  })
  price: number;
}
