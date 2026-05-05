import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  MASTER_API_KEY: process.env.MASTER_API_KEY || 'master_key_123',
};
