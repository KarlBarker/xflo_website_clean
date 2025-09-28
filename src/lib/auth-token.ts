/**
 * Simple auth token management for xFlo Chat API
 * This is a placeholder implementation that should be replaced with your actual auth system
 */

class AuthTokenManager {
  private tokenKey = 'xflo_auth_token';

  /**
   * Get the current auth token
   * For now, this will prompt the user to enter a token if none exists
   */
  async getToken(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Authentication is only available in the browser');
    }

    // Check if we have a stored token
    let token = localStorage.getItem(this.tokenKey);
    
    if (!token) {
      // Option 1: Manual token entry (current approach)
      token = prompt(
        'Please enter your xFlo API authentication token:\n\n' +
        'Alternatively, the RAG team can provide signin credentials for /api/auth/signin'
      );
      
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      // Store the token for future use
      localStorage.setItem(this.tokenKey, token);
    }
    
    return token;
  }

  /**
   * Sign in using the backend auth endpoint
   */
  async signIn(email: string, password: string): Promise<string> {
    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Sign in failed');
    }

    const { session } = await response.json();
    this.setToken(session);
    return session;
  }

  /**
   * Set a new auth token
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  /**
   * Clear the stored auth token
   */
  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Check if we have a stored token
   */
  hasToken(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(this.tokenKey);
  }
}

export const authTokenManager = new AuthTokenManager();