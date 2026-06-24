import type { AxiosRequestConfig } from 'axios'
import api from './api.ts'

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
  }
}

export class ApiModel {
  protected readonly basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  protected async get<T>(path = '', config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await api.get<ApiResponse<T>>(this.basePath + path, config)
    return res.data
  }

  protected async post<T>(path = '', body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.post<T>(this.basePath + path, body, config)
    return res.data
  }

  protected async patch<T>(path = '', body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.patch<T>(this.basePath + path, body, config)
    return res.data
  }

  protected async put<T>(path = '', body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.put<T>(this.basePath + path, body, config)
    return res.data
  }

  protected async delete(path = '', config?: AxiosRequestConfig): Promise<void> {
    await api.delete(this.basePath + path, config)
  }
}
