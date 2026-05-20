export interface Envelope<T> {
  data: T
}

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginatedMeta
}

export interface ApiErrorBody {
  statusCode: number
  message: string | string[]
  error: string
}

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}
