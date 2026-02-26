export interface SearchAnalyticsQuery {
  days?: number;
  topN?: number;
  workspaceId?: string;
  source?: string;
}

export interface ChatAnalyticsQuery {
  days?: number;
}

export interface FeedbackAnalyticsQuery {
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchAnalyticsResponse {
  total_searches: number;
  unique_queries: number;
  avg_results: number;
  zero_result_rate: number;
  top_queries?: Array<{
    query: string;
    count: number;
    avg_results: number;
  }>;
  by_period?: Array<{
    period: string;
    searches: number;
  }>;
}

export interface ChatAnalyticsResponse {
  total_messages: number;
  total_threads: number;
  avg_messages_per_thread: number;
  handoff_rate: number;
  by_period?: Array<{
    period: string;
    messages: number;
    threads: number;
  }>;
}

// FeedbackAnalyticsResponse is defined in ./feedback.ts to avoid duplication
