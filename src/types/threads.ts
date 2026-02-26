export interface ThreadSearchRequest {
  limit?: number;
  offset?: number;
  filters?: {
    user_id?: string;
    status?: string;
    created_after?: string;
    created_before?: string;
    has_handoff?: boolean;
  };
  sort_by?: 'created_at' | 'updated_at' | 'message_count';
  sort_order?: 'asc' | 'desc';
}

export interface ThreadSummary {
  id: string;
  user_id?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export interface ThreadSearchResponse {
  results: ThreadSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface ThreadMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ThreadMessagesResponse {
  messages: ThreadMessage[];
}
