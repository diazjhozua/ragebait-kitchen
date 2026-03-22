export interface LeaderboardEntry {
  id: string;              // UUID
  createdAt: string;       // ISO string
  playerName: string;
  recipeTitle?: string;    // Optional
  recipeContent: string;   // Full recipe content
  rage_score: number;      // 0-100
  tags: string[];
  reaction: string;        // Full reaction text
  judgeStyle: string;      // Which judge style was used
}

export interface LeaderboardStats {
  totalEntries: number;
  averageRageScore: number;
  highestRageScore: number;
  mostCommonTags: string[];
}