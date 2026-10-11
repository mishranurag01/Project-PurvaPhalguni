import { ApiResponse, ApiErrorResponse } from '../../types/api';
import { AppError, NetworkError, ValidationError } from '../../errors/AppError';
import { env } from '../../config/env';

export interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  mockDelayMs?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl = env.appUrl) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }

  public setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Mock execution wrapper that simulates network latency and returns an ApiResponse
   */
  public async executeMock<T>(
    operation: () => T | Promise<T>,
    options: RequestOptions = { mockDelayMs: 60 }
  ): Promise<ApiResponse<T>> {
    try {
      if (options.mockDelayMs && options.mockDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, options.mockDelayMs));
      }

      const result = await operation();
      return {
        success: true,
        data: result,
        timestamp: Date.now()
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        error?.message || 'Failed to execute operation',
        'API_EXECUTION_ERROR',
        500,
        'error',
        true,
        { original: error }
      );
    }
  }

  /**
   * Extensible fetch wrapper for production REST/GraphQL backends
   */
  public async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...(options?.headers || {})
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        throw new AppError(
          errorData.message || `Request failed with status ${response.status}`,
          `HTTP_${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: Date.now()
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new NetworkError(error?.message);
    }
  }
}

export const apiClient = new ApiClient();
