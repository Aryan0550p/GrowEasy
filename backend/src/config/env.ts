import { config } from 'dotenv';
config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  
  AI_PROVIDER: (process.env.AI_PROVIDER || 'openai') as 'openai' | 'gemini' | 'anthropic',
  AI_MODEL: process.env.AI_MODEL || 'gpt-4o-mini',
  
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  
  MAX_BATCH_SIZE: parseInt(process.env.MAX_BATCH_SIZE || '50', 10),
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3', 10),
  RETRY_DELAY_MS: parseInt(process.env.RETRY_DELAY_MS || '1000', 10),
  
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
