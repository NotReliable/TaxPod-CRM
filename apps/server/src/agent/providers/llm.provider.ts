import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

export type LLMProviderType = 'google' | 'anthropic' | 'openai';

export function getModel(provider?: LLMProviderType): LanguageModel {
  const selected = provider || (process.env.LLM_PROVIDER as LLMProviderType) || 'google';

  switch (selected) {
    case 'google': {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
      return google('gemini-2.0-flash');
    }
    case 'anthropic':
      return anthropic('claude-sonnet-4-20250514');
    case 'openai': {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      return openai('gpt-4o-mini');
    }
    default:
      throw new Error(`Unknown LLM provider: ${selected}. Supported: google, anthropic, openai`);
  }
}
