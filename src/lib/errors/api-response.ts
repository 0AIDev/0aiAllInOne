import { NextResponse } from "next/server";
import { AppError } from "./app-error";

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export function apiError(
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: { code, message, ...(details && { details }) } },
    { status }
  );
}

export function apiSuccess<T>(data: T, status = 200, meta?: ApiSuccessResponse["meta"]): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { data, ...(meta && { meta }) },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return apiError(error.statusCode, error.code, error.message, error.details);
  }

  if (error instanceof Error) {
    console.error("Unhandled error:", error);
    return apiError(500, "INTERNAL_ERROR", "An unexpected error occurred");
  }

  return apiError(500, "INTERNAL_ERROR", "An unknown error occurred");
}

export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  return { page, limit, skip: (page - 1) * limit };
}
