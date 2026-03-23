import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';

export type LLMProviderType = 'google' | 'anthropic';

export function getModel(provider?: LLMProviderType) {
  const selected = provider || (process.env.LLM_PROVIDER as LLMProviderType) || 'google';

  switch (selected) {
    case 'google':
      return google('gemini-2.0-flash');
    case 'anthropic':
      return anthropic('claude-sonnet-4-20250514');
    default:
      throw new Error(`Unknown LLM provider: ${selected}. Supported: google, anthropic`);
  }
}
