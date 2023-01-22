import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: "ADMIN" | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | null;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: "ADMIN" | null;
  }
}
