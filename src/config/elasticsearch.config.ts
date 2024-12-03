import { registerAs } from '@nestjs/config';

export default registerAs('elasticsearch', () => ({
  node: process.env.ES_NODE || 'https://localhost:9200',
  auth: {
    username: process.env.ES_USERNAME || 'elastic',
    password: process.env.ES_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  maxRetries: 3,
  requestTimeout: 30000,
  ssl: {
    enabled: true,
  },
}));
