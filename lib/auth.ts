
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { query } from "./db";

const COOKIE_NAME = "vtcar_session";
const SESSION_DURATION = 60 * 60 * 8;
const JWT_ALGORITHM = "HS256";

export type UserRole =
  | "master"
  | "admin"
  | "manager"
  | "employee";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET ausente ou inválida.");
  }

  return new TextEncoder().encode(secret);
}

export async function hashPassword(
  password: string
): Promise<string> {
  if (typeof password !== "string" || password.length < 8) {
    throw new Error(
      "A senha precisa ter pelo menos 8 caracteres."
    );
  }

  if (password.length > 72) {
    throw new Error(
      "A senha não pode ultrapassar 72 caracteres."
    );
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error(
      "A senha precisa conter pelo menos um símbolo especial."
    );
  }

  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  if (
    typeof password !== "string" ||
    typeof passwordHash !== "string" ||
    !passwordHash
  ) {
    return false;
  }

  try {
    return await bcrypt.compare(password, passwordHash);
  } catch {
    return false;
  }
}

export async function createSession(
  user: Pick<AuthUser, "id">
): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  let userId: string;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [JWT_ALGORITHM],
    });

    if (!payload.sub) {
      throw new Error("Sessão sem identificador.");
    }

    userId = payload.sub;
  } catch {
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return null;
  }

  const result = await query<AuthUser & { active: boolean }>(
    `SELECT id, name, email, role, active
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  const user = result.rows[0];

  if (!user || !user.active) {
    await destroySession();
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function hasRole(
  user: AuthUser | null,
  allowedRoles: UserRole[]
): boolean {
  return !!user && allowedRoles.includes(user.role);
}
