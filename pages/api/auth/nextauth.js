import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      // Persist the user ID to the token right after signing in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      // Persist the user ID to the session
      session.user.id = token.id;
      return session;
    },
  },
});
