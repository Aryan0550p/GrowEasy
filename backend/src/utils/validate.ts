import { ENV } from '../config/env';

export const validateAIConfig = (): void => {
  const provider = ENV.AI_PROVIDER;
  const keyMap: Record<string, string> = {
    openai: ENV.OPENAI_API_KEY,
    gemini: ENV.GEMINI_API_KEY,
    anthropic: ENV.ANTHROPIC_API_KEY,
  };

  if (!keyMap[provider]) {
    console.warn(`WARNING: No API key found for AI provider "${provider}". Set the appropriate key in .env`);
  }
};
