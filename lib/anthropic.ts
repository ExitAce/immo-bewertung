import Anthropic from '@anthropic-ai/sdk';
import { extractJsonFromResponse } from './prompts';

// ============================================================================
// ANTHROPIC CLIENT SETUP
// ============================================================================

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
  }

  return new Anthropic({
    apiKey,
  });
}

// ============================================================================
// CALL ANTHROPIC API
// ============================================================================

export interface AnthropicCallOptions {
  system: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  useWebSearch?: boolean;
}

export interface AnthropicResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Call the Anthropic API with the given prompt configuration
 */
export async function callAnthropic(
  options: AnthropicCallOptions
): Promise<AnthropicResponse> {
  const {
    system,
    userMessage,
    temperature = 0.3,
    maxTokens = 4096,
    useWebSearch = false,
  } = options;

  const client = getAnthropicClient();

  try {
    // Prepare the message request
    const messageParams: Anthropic.MessageCreateParams = {
      model: 'claude-sonnet-4-20250514', // Latest Claude Sonnet 4.5
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    };

    // Add web search tool if requested
    if (useWebSearch) {
      messageParams.tools = [
        {
          type: 'web_search_20250124' as any, // Web search tool
          name: 'web_search',
          web_search: {},
        } as any,
      ];
    }

    // Make the API call
    const response = await client.messages.create(messageParams);

    // Extract text content
    let content = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        content += block.text;
      }
    }

    return {
      content,
      usage: response.usage
        ? {
            input_tokens: response.usage.input_tokens,
            output_tokens: response.usage.output_tokens,
          }
        : undefined,
    };
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error(
      error instanceof Error
        ? `Anthropic API call failed: ${error.message}`
        : 'Anthropic API call failed with unknown error'
    );
  }
}

// ============================================================================
// CALL ANTHROPIC AND PARSE JSON RESPONSE
// ============================================================================

export async function callAnthropicForJson<T>(
  options: AnthropicCallOptions
): Promise<T> {
  const response = await callAnthropic(options);

  try {
    // Extract JSON from the response (handles markdown code blocks)
    const jsonString = extractJsonFromResponse(response.content);

    // Parse the JSON
    const parsed = JSON.parse(jsonString);
    return parsed as T;
  } catch (error) {
    console.error('JSON Parsing Error:', error);
    console.error('Raw Response:', response.content);
    throw new Error(
      `Failed to parse JSON response from Anthropic: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
