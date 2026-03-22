export interface Recipe {
  title?: string;
  content: string;
}

export interface JudgeResponse {
  rage_score: number;        // 0-100 as specified
  tags: string[];           // e.g., ["disgusting", "amateur"]
  reasons: string[];        // Short bullet points
  reaction: string;         // Full comedic chef rant
  similarity?: {           // Similarity detection info (optional for backwards compatibility)
    maxSimilarity: number;
    originalScore: number;
    penalty: number;
    penaltyType: 'none' | 'minor' | 'moderate' | 'severe';
    message: string;
    mostSimilarRecipe?: {
      title?: string;
      content: string;
    };
  };
}

export interface JudgeRequest {
  recipe: Recipe;
  playerName: string;
  judgeStyle: JudgeStyle;
  apiKey: string;
}

export type JudgeStyle = 'classic-rage' | 'dry-sarcasm' | 'disappointed' | 'constructive';

export interface ApiError {
  message: string;
  type: 'network' | 'invalid-key' | 'rate-limit' | 'validation' | 'unknown';
  retryable: boolean;
}