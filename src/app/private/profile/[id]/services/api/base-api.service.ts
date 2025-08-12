import wingManApi from '@/lib/axios';
import { AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

export class BaseApiService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const url = `${this.basePath}${endpoint}`;
      
      let response: AxiosResponse<T>;
      
      switch (method) {
        case 'GET':
          response = await wingManApi.get(url, config);
          break;
        case 'POST':
          response = await wingManApi.post(url, data, config);
          break;
        case 'PUT':
          response = await wingManApi.put(url, data, config);
          break;
        case 'PATCH':
          response = await wingManApi.patch(url, data, config);
          break;
        case 'DELETE':
          response = await wingManApi.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'An error occurred',
        code: error.response?.data?.code || error.code,
        field: error.response?.data?.field,
        details: error.response?.data
      };
      
      console.error(`API Error [${method} ${endpoint}]:`, apiError);
      throw apiError;
    }
  }

  protected async get<T>(endpoint: string, config?: any): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  protected async post<T>(endpoint: string, data?: any, config?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data, config);
  }

  protected async put<T>(endpoint: string, data?: any, config?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  protected async patch<T>(endpoint: string, data?: any, config?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  protected async delete<T>(endpoint: string, config?: any): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  // Generic CRUD operations
  async findAll<T>(params?: any): Promise<T[]> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get<T[]>(`${queryString}`);
  }

  async findById<T>(id: string): Promise<T> {
    return this.get<T>(`/${id}`);
  }

  async create<T>(data: Partial<T>): Promise<T> {
    return this.post<T>('', data);
  }

  async update<T>(id: string, data: Partial<T>): Promise<T> {
    return this.put<T>(`/${id}`, data);
  }

  async partialUpdate<T>(id: string, data: Partial<T>): Promise<T> {
    return this.patch<T>(`/${id}`, data);
  }

  async remove(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }

  // Batch operations
  async createMany<T>(items: Partial<T>[]): Promise<T[]> {
    return this.post<T[]>('/batch', { items });
  }

  async updateMany<T>(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    return this.patch<T[]>('/batch', { updates });
  }

  async removeMany(ids: string[]): Promise<void> {
    return this.delete<void>('/batch', { data: { ids } });
  }

  // Search and filtering
  async search<T>(query: string, filters?: any): Promise<T[]> {
    const params = { q: query, ...filters };
    return this.get<T[]>(`/search?${new URLSearchParams(params).toString()}`);
  }

  async filter<T>(filters: Record<string, any>): Promise<T[]> {
    return this.get<T[]>(`/filter?${new URLSearchParams(filters).toString()}`);
  }

  // Pagination support
  async paginate<T>(page: number = 1, limit: number = 10, filters?: any): Promise<PaginatedResponse<T>> {
    const params = { page: page.toString(), limit: limit.toString(), ...filters };
    return this.get<PaginatedResponse<T>>(`/paginate?${new URLSearchParams(params).toString()}`);
  }
}