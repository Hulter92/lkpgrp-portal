import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // körs vid login
      if (account && profile) {
        token.id = profile.id; // Discord user ID
      }
      return token;
    },

    async session({ session, token }) {
      // skickas till frontend
      session.user.id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };