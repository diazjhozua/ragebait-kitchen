import OpenAI from 'openai';
import type { JudgeRequest, JudgeResponse, ApiError } from '../types/game';
import { validateWithSchema, judgeResponseSchema } from '../utils/validation';
import { buildJudgePrompt, RETRY_PROMPT, FALLBACK_RESPONSES } from '../utils/prompts';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

export class OpenAIService {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  setApiKey(apiKey: string): void {
    try {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw new Error('Failed to initialize OpenAI client');
    }
  }

  async judgeRecipe(request: JudgeRequest): Promise<JudgeResponse> {
    if (!this.openai) {
      throw this.createApiError('API key not set', 'invalid-key', false);
    }

    const prompt = buildJudgePrompt(request.judgeStyle, request.playerName, request.recipe);

    let lastError: Error | null = null;

    // Retry loop
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await this.callOpenAI(prompt, attempt > 0);
        const validationResult = this.validateResponse(response);

        if (validationResult.success) {
          return validationResult.data;
        }

        // If validation failed and we have retries left, try again
        if (attempt < MAX_RETRIES) {
          console.warn(`Validation failed on attempt ${attempt + 1}, retrying...`);
          await this.delay(RETRY_DELAY);
          continue;
        }

        // Final attempt failed validation
        throw this.createApiError(
          `AI response validation failed: ${validationResult.error}`,
          'validation',
          false
        );

      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (this.isRetryableError(error) && attempt < MAX_RETRIES) {
          console.warn(`Request failed on attempt ${attempt + 1}, retrying...`, error);
          await this.delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
          continue;
        }

        // Either not retryable or out of retries
        break;
      }
    }

    // All attempts failed, throw the last error or provide fallback
    if (lastError) {
      throw this.handleFinalError(lastError);
    }

    // This shouldn't happen, but just in case
    return FALLBACK_RESPONSES.validationFailure;
  }

  private async callOpenAI(prompt: string, isRetry: boolean = false): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: prompt }
    ];

    // Add retry instruction if this is a retry attempt
    if (isRetry) {
      messages.push({ role: 'user', content: RETRY_PROMPT });
    }

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4', // Using GPT-4 for better JSON consistency
      messages,
      temperature: 0.8, // Some creativity but not too wild
      max_tokens: 500,   // Reasonable limit for judge responses
      response_format: { type: 'json_object' } // Force JSON response
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    return content;
  }

  private validateResponse(content: string):
    | { success: true; data: JudgeResponse }
    | { success: false; error: string } {

    try {
      const parsed = JSON.parse(content);
      return validateWithSchema(judgeResponseSchema, parsed, 'judge response');
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse JSON: ${String(error)}`
      };
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    const message = error.message.toLowerCase();

    // Network/temporary errors that might resolve on retry
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('rate limit') ||
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504')
    );
  }

  private handleFinalError(error: Error): ApiError {
    const message = error.message.toLowerCase();

    if (message.includes('api key') || message.includes('unauthorized')) {
      return this.createApiError('Invalid API key', 'invalid-key', false);
    }

    if (message.includes('rate limit') || message.includes('quota')) {
      return this.createApiError('Rate limit exceeded', 'rate-limit', true);
    }

    if (message.includes('network') || message.includes('timeout')) {
      return this.createApiError('Network error', 'network', true);
    }

    return this.createApiError(
      error.message || 'Unknown error occurred',
      'unknown',
      false
    );
  }

  private createApiError(message: string, type: ApiError['type'], retryable: boolean): ApiError {
    return {
      message,
      type,
      retryable
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance for easy access
let openAIService: OpenAIService | null = null;

export function getOpenAIService(apiKey?: string): OpenAIService {
  if (!openAIService) {
    openAIService = new OpenAIService(apiKey);
  } else if (apiKey) {
    openAIService.setApiKey(apiKey);
  }
  return openAIService;
}