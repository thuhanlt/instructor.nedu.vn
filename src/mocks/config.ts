import { HttpResponse } from 'msw'

export function unauthorized(message = 'Unauthorized') {
  return HttpResponse.json(
    { statusCode: 401, message, error: 'Unauthorized' },
    { status: 401 }
  )
}

export function notFound(message = 'Not Found') {
  return HttpResponse.json(
    { statusCode: 404, message, error: 'Not Found' },
    { status: 404 }
  )
}

export function badRequest(message: string | string[] = 'Bad Request') {
  return HttpResponse.json(
    { statusCode: 400, message, error: 'Bad Request' },
    { status: 400 }
  )
}
