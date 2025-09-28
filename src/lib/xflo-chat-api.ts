interface ChatRequest {
  content: string;
  thread_id?: string;
  strategy?: 'full_context' | 'semantic' | 'hybrid';
  model?: string;
  labels?: string[];
  source_type?: string;
  top_k?: number;
  similarity_threshold?: number;
}

interface StreamData {
  type: 'content' | 'thread_id' | 'done' | 'error' | 'status';
  content?: string;
  thread_id?: string;
  status?: string;
  message?: string;
  flash?: boolean;
}

export class XFloChatAPI {
  private baseUrl: string;
  
  constructor() {
    // Use development API for localhost, production API for deployed sites
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      this.baseUrl = 'http://localhost:8080';
    } else {
      this.baseUrl = process.env.NEXT_PUBLIC_XFLO_API_URL || 'https://api.xflo.ai';
    }
  }

  async streamChat(
    request: ChatRequest,
    token: string | null = null,
    onData: (data: StreamData) => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      // Use public endpoint - no auth required
      const endpoint = `${this.baseUrl}/api/public/chat/stream`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Only add auth header if token is provided (for backwards compatibility)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: request.content, // Public endpoint uses 'content' not full request object
          strategy: request.strategy || 'full_context'
        }),
        signal
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please refresh and try again.');
        }
        if (response.status === 403) {
          throw new Error('Account access required. Please contact support.');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onData(data);
            } catch (e) {
              console.error('Error parsing SSE data:', e, 'Line:', line);
            }
          }
        }
      }

      // Process any remaining data in the buffer
      if (buffer && buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(6));
          onData(data);
        } catch (e) {
          console.error('Error parsing final SSE data:', e);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the request
        return;
      }
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // Helper method to get auth token - integrates with auth token manager
  async getAuthToken(): Promise<string> {
    const { authTokenManager } = await import('./auth-token');
    return authTokenManager.getToken();
  }
}

export const xfloChatAPI = new XFloChatAPI();