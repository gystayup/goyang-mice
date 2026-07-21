/**
 * Error Handling & Response Utilities
 * API 응답 표준화 및 에러 처리
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, code?: string) {
    super(400, message, code || 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = '요청한 리소스를 찾을 수 없습니다.') {
    super(404, message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = '인증이 필요합니다.') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = '권한이 없습니다.') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = '이미 존재하는 데이터입니다.') {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = '서버 오류가 발생했습니다.') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}

/**
 * 성공 응답을 생성합니다
 */
export function successResponse<T = unknown>(data: T, message?: string) {
  return {
    success: true,
    message: message || '요청이 성공했습니다.',
    data,
  };
}

/**
 * 에러 응답을 생성합니다
 */
export function errorResponse(error: unknown, message?: string) {
  if (error instanceof ApiError) {
    return {
      success: false,
      statusCode: error.statusCode,
      error: error.message,
      code: error.code,
    };
  }

  return {
    success: false,
    statusCode: 500,
    error: message || '요청 처리 중 오류가 발생했습니다.',
    code: 'INTERNAL_SERVER_ERROR',
  };
}

/**
 * 페이지네이션 메타데이터를 생성합니다
 */
export function paginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}
