import type { InsertUser, User } from "@shared/types";
import { ENV } from './_core/env';

const usersByOpenId = new Map<string, User>();
let nextUserId = 1;

function cloneUser(user: User): User {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    lastSignedIn: new Date(user.lastSignedIn),
  };
}

export async function getDb() {
  return null;
}

function applyField<T extends keyof Pick<User, "name" | "email" | "loginMethod">>(
  target: User,
  source: InsertUser,
  field: T
) {
  if (source[field] !== undefined) {
    target[field] = source[field] ?? null;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const now = new Date();
  const existing = usersByOpenId.get(user.openId);

  if (existing) {
    applyField(existing, user, "name");
    applyField(existing, user, "email");
    applyField(existing, user, "loginMethod");

    if (user.role !== undefined) {
      existing.role = user.role;
    }

    existing.lastSignedIn = user.lastSignedIn ?? existing.lastSignedIn;
    existing.updatedAt = user.updatedAt ?? now;
    usersByOpenId.set(user.openId, existing);
    return;
  }

  const role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  const createdAt = user.createdAt ?? now;
  const inserted: User = {
    id: nextUserId++,
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    role,
    createdAt,
    updatedAt: user.updatedAt ?? now,
    lastSignedIn: user.lastSignedIn ?? now,
  };
  usersByOpenId.set(user.openId, inserted);
}

export async function getUserByOpenId(openId: string) {
  const user = usersByOpenId.get(openId);
  return user ? cloneUser(user) : undefined;
}

// TODO: add feature queries here as your app grows.
