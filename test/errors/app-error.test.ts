import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  RateLimitError,
  ConflictError,
  InternalError,
  ServiceUnavailableError,
} from "@/lib/errors/app-error";

describe("AppError", () => {
  it("should create a base error", () => {
    const err = new AppError("test", "TEST_CODE", 418);
    expect(err.message).toBe("test");
    expect(err.code).toBe("TEST_CODE");
    expect(err.statusCode).toBe(418);
    expect(err.name).toBe("AppError");
  });

  it("should default to 500", () => {
    const err = new AppError("test", "ERROR");
    expect(err.statusCode).toBe(500);
  });
});

describe("NotFoundError", () => {
  it("should format message with resource", () => {
    const err = new NotFoundError("User");
    expect(err.message).toBe("User not found");
    expect(err.statusCode).toBe(404);
  });
});

describe("ValidationError", () => {
  it("should include details", () => {
    const err = new ValidationError("Invalid input", { field: "email" });
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual({ field: "email" });
  });
});

describe("UnauthorizedError", () => {
  it("should have status 401", () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });

  it("should allow custom message", () => {
    const err = new UnauthorizedError("Invalid token");
    expect(err.message).toBe("Invalid token");
  });
});

describe("ForbiddenError", () => {
  it("should have status 403", () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
  });
});

describe("RateLimitError", () => {
  it("should include retryAfter", () => {
    const err = new RateLimitError("Too many requests", 60);
    expect(err.statusCode).toBe(429);
    expect(err.details?.retryAfter).toBe(60);
  });
});

describe("ConflictError", () => {
  it("should have status 409", () => {
    const err = new ConflictError("Resource exists");
    expect(err.statusCode).toBe(409);
  });
});

describe("InternalError", () => {
  it("should include cause message in details", () => {
    const cause = new Error("DB connection failed");
    const err = new InternalError("Oops", cause);
    expect(err.statusCode).toBe(500);
    expect(err.details?.cause).toBe("DB connection failed");
  });
});

describe("ServiceUnavailableError", () => {
  it("should have status 503", () => {
    const err = new ServiceUnavailableError();
    expect(err.statusCode).toBe(503);
  });
});
