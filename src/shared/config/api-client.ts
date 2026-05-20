import { env } from './env'
import { tokenStorage } from './token-storage'
import { authCentral } from './auth-central-client'
import { ApiError, type Envelope, type Paginated } from '../types/api'

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
  multipart?: FormData
  signal?: AbortSignal
  skipAuthRefresh?: boolean
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const base = env.apiUrl.replace(/\/$/, '')
  const url = new URL(`${base}/api${path.startsWith('/') ? path : `/${path}`}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

async function rawRequest<T>(method: Method, path: string, opts: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query)
  const headers: Record<string, string> = {}

  const access = tokenStorage.getAccess()
  if (access) headers['Authorization'] = `Bearer ${access}`

  let body: BodyInit | undefined
  if (opts.multipart) {
    body = opts.multipart
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(opts.body)
  }

  const res = await fetch(url, { method, headers, body, signal: opts.signal })

  if (res.status === 401 && !opts.skipAuthRefresh) {
    const refreshed = await authCentral.refresh()
    if (refreshed) {
      return rawRequest<T>(method, path, { ...opts, skipAuthRefresh: true })
    }
    tokenStorage.clear()
    throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED')
  }

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : undefined
  } catch {
    throw new ApiError(res.status, `Invalid JSON response: ${text.slice(0, 120)}`)
  }

  if (!res.ok) {
    const errBody = (json ?? {}) as Partial<{ statusCode: number; message: string | string[]; error: string }>
    const message = Array.isArray(errBody.message)
      ? errBody.message.join(', ')
      : errBody.message ?? `Request failed (${res.status})`
    throw new ApiError(res.status, message, errBody.error)
  }

  return json as T
}

async function unwrap<T>(method: Method, path: string, opts?: RequestOptions): Promise<T> {
  const result = await rawRequest<Envelope<T> | T>(method, path, opts)
  if (result && typeof result === 'object' && 'data' in (result as Record<string, unknown>)) {
    return (result as Envelope<T>).data
  }
  return result as T
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query'], opts?: Omit<RequestOptions, 'query'>) =>
    unwrap<T>('GET', path, { ...opts, query }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'body'>) =>
    unwrap<T>('POST', path, { ...opts, body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'body'>) =>
    unwrap<T>('PATCH', path, { ...opts, body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'body'>) =>
    unwrap<T>('PUT', path, { ...opts, body }),
  del: <T>(path: string, opts?: RequestOptions) => unwrap<T>('DELETE', path, opts),
  postMultipart: <T>(path: string, form: FormData) =>
    unwrap<T>('POST', path, { multipart: form }),
  getRaw: <T>(path: string, query?: RequestOptions['query']) =>
    rawRequest<Paginated<T>>('GET', path, { query }),
}
