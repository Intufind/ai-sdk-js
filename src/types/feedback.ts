export interface FeedbackSubmitRequest {
  threadId: string;
  rating: 'positive' | 'negative';
  comment?: string;
  messageIndex?: number;
  metadata?: Record<string, unknown>;
}

export interface FeedbackEntry {
  id: string;
  threadId: string;
  rating: 'positive' | 'negative';
  comment?: string;
  messageIndex?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface FeedbackSearchRequest {
  limit?: number;
  offset?: number;
  filters?: {
    rating?: 'positive' | 'negative';
    thread_id?: string;
    created_after?: string;
    created_before?: string;
  };
}

export interface FeedbackSearchResponse {
  results: FeedbackEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface FeedbackAnalyticsResponse {
  total: number;
  positive: number;
  negative: number;
  positive_rate: number;
  by_period?: Array<{
    period: string;
    positive: number;
    negative: number;
  }>;
}
