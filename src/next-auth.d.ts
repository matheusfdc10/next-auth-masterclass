import { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendeUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}

declare module "next-auth" {
  interface Session {
    user: ExtendeUser;
  }
}