import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("google_id", account.providerAccountId)
            .single();

          if (!existingUser) {
            await supabaseAdmin.from("users").insert({
              google_id: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
            });
          }
        } catch {
          // User creation failed, but allow sign-in
          console.error("Failed to upsert user in Supabase");
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { googleId?: string }).googleId =
          token.googleId as string;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.googleId = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
