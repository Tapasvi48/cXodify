import { type ClassValue, clsx } from "clsx";
import { NextAuthOptions } from "next-auth";
import { twMerge } from "tailwind-merge";
// imports
import { db } from "@/app/db";
import { auth } from "@/components/problems/auth";

// importing providers
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const authOption: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (!profile?.email) {
        throw new Error("no profile");
      }
      const userData = await db.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          firstName: profile?.name || "",
          lastName: "",
          password: "",
        },
        update: {
          firstName: profile.name,
        },
      });
      console.log("account", account, profile);
      user.id = userData.id;

      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        // Assign database user id to session user id
        session.user.id = token.sub;
        console.log("Token sub (user id):", token.sub);
      }
      return session;
    },
    jwt: async ({ user, token, account }) => {
      if (user) {
        token.sub = user.id; // Example: Attach user id to token
        console.log("uyserr id is", user.id);
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
