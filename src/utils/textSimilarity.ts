// Text similarity utilities for detecting similar recipes

/**
 * Normalize text for comparison
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Tokenize text into words
 */
function tokenize(text: string): Set<string> {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter(word => word.length > 2); // Ignore very short words
  return new Set(words);
}

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Calculate word overlap similarity between two texts
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  return jaccardSimilarity(tokens1, tokens2);
}

/**
 * Calculate recipe similarity including title and content
 */
export function calculateRecipeSimilarity(
  recipe1: { title?: string; content: string },
  recipe2: { title?: string; content: string }
): number {
  // Combine title and content for comparison
  const text1 = `${recipe1.title || ''} ${recipe1.content}`;
  const text2 = `${recipe2.title || ''} ${recipe2.content}`;

  return calculateTextSimilarity(text1, text2);
}

/**
 * Find the highest similarity score against a list of previous recipes
 */
export function findMaxSimilarity(
  newRecipe: { title?: string; content: string },
  previousRecipes: Array<{ title?: string; content: string }>
): {
  maxSimilarity: number;
  mostSimilarRecipe?: { title?: string; content: string };
} {
  if (previousRecipes.length === 0) {
    return { maxSimilarity: 0 };
  }

  let maxSimilarity = 0;
  let mostSimilarRecipe: { title?: string; content: string } | undefined;

  for (const recipe of previousRecipes) {
    const similarity = calculateRecipeSimilarity(newRecipe, recipe);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarRecipe = recipe;
    }
  }

  return { maxSimilarity, mostSimilarRecipe };
}

/**
 * Calculate rage score penalty based on similarity
 */
export function calculateSimilarityPenalty(similarity: number): {
  penalty: number;
  penaltyType: 'none' | 'minor' | 'moderate' | 'severe';
  message: string;
} {
  if (similarity < 0.3) {
    return {
      penalty: 0,
      penaltyType: 'none',
      message: ''
    };
  } else if (similarity < 0.5) {
    return {
      penalty: 5,
      penaltyType: 'minor',
      message: 'Your recipe is somewhat similar to a previous submission. Try to be more creative!'
    };
  } else if (similarity < 0.7) {
    return {
      penalty: 15,
      penaltyType: 'moderate',
      message: 'This recipe is quite similar to one you\'ve submitted before. Gordon expects more originality!'
    };
  } else {
    return {
      penalty: 30,
      penaltyType: 'severe',
      message: 'This recipe is very similar to a previous submission. Gordon is tired of seeing the same disasters over and over!'
    };
  }
}

/**
 * Apply similarity penalty to rage score
 */
export function applySimilarityPenalty(
  originalScore: number,
  similarity: number
): {
  adjustedScore: number;
  penalty: number;
  penaltyType: 'none' | 'minor' | 'moderate' | 'severe';
  message: string;
} {
  const penaltyInfo = calculateSimilarityPenalty(similarity);
  const adjustedScore = Math.max(0, originalScore - penaltyInfo.penalty);

  return {
    adjustedScore,
    penalty: penaltyInfo.penalty,
    penaltyType: penaltyInfo.penaltyType,
    message: penaltyInfo.message
  };
}

/**
 * Get similarity description for UI display
 */
export function getSimilarityDescription(similarity: number): string {
  if (similarity < 0.1) return 'Completely unique';
  if (similarity < 0.3) return 'Mostly original';
  if (similarity < 0.5) return 'Somewhat similar';
  if (similarity < 0.7) return 'Quite similar';
  return 'Very similar';
}

/**
 * Get similarity level for styling purposes
 */
export function getSimilarityLevel(similarity: number): 'low' | 'medium' | 'high' | 'very-high' {
  if (similarity < 0.3) return 'low';
  if (similarity < 0.5) return 'medium';
  if (similarity < 0.7) return 'high';
  return 'very-high';
}