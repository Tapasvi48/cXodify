// imports
import { db } from "@/app/db";
import { auth } from "@/components/problems/auth";
import { authOption } from "@/lib/utils";
import NextAuth, { NextAuthOptions } from "next-auth";

// importing providers
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
