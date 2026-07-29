import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import type { TenantRole } from "@prisma/client";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long");
  }
  return new TextEncoder().encode(secret);
}

const SESSION_COOKIE = "ai0fy_session";
const SESSION_EXPIRY = "7d";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

interface SessionPayload {
  [key: string]: unknown;
  userId: string;
  tenantId: string;
  role: TenantRole;
  email: string;
}

export async function createSession(
  userId: string,
  tenantId: string,
  role: TenantRole,
  email: string
): Promise<string> {
  const token = await new SignJWT({ userId, tenantId, role, email } as SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .setJti(crypto.randomUUID())
    .sign(getJwtSecret());

  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    // Verify token exists in DB (not revoked)
    const session = await prisma.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) return null;

    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await verifySession();
  if (!session) throw new AuthError("Unauthorized", 401);
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role === "MEMBER") throw new AuthError("Forbidden", 403);
  return session;
}

export async function login(email: string, password: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new AuthError("Invalid credentials", 401);

  const valid = await compare(password, user.passwordHash);
  if (!valid) throw new AuthError("Invalid credentials", 401);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Delete old sessions for this user
  await prisma.session.deleteMany({ where: { userId: user.id } });

  return createSession(user.id, user.tenantId, user.role, user.email);
}

export async function register(params: {
  email: string;
  password: string;
  name: string;
  tenantName: string;
}): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
  });
  if (existing) throw new AuthError("Email already registered", 409);

  const passwordHash = await hash(params.password, 12);

  const slug = params.tenantName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .substring(0, 100);

  const tenant = await prisma.tenant.create({
    data: {
      name: params.tenantName,
      slug,
    },
  });

  // Copy admin tenant's provider pool to new tenant
  const adminTenant = await prisma.tenant.findFirst({
    where: { planTier: "ENTERPRISE" },
    include: { providerPool: true },
  });

  if (adminTenant?.providerPool.length) {
    await prisma.providerPoolEntry.createMany({
      data: adminTenant.providerPool.map((entry) => ({
        tenantId: tenant.id,
        providerId: entry.providerId,
        modelId: entry.modelId,
        priority: entry.priority,
        weight: entry.weight,
      })),
    });
  }

  const user = await prisma.user.create({
    data: {
      email: params.email,
      passwordHash,
      name: params.name,
      tenantId: tenant.id,
      role: "OWNER",
    },
  });

  const { generateApiToken, hashApiKey, getKeyPrefix } = await import(
    "@/lib/utils/encryption"
  );
  const rawKey = generateApiToken();
  const hashedKey = hashApiKey(rawKey);
  const prefixKey = getKeyPrefix(rawKey);

  await prisma.apiKey.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      name: "Default Key",
      prefixKey,
      hashedKey,
    },
  });

  return createSession(user.id, tenant.id, "OWNER", user.email);
}

export function setSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE / 1000}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function getSessionCookie(): string {
  return SESSION_COOKIE;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}
