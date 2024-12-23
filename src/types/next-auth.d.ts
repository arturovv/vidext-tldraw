import { Role } from "@prisma/client";
import NextAuth, { Session } from "next-auth"
import { JWT } from "next-auth/jwt";

interface User {
  id: string
  email: string
}

declare module 'next-auth' {
  interface Session {
    user?: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User
  }
}