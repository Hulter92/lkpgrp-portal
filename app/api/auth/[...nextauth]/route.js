import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
  async jwt({ token }) {
    if (!token.sub) return token;

    try {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/discord/role?userId=${token.sub}`
      );

      const data = await res.json();
      const roles = data.roles || [];

      if (roles.includes("1501163659760500868")) {
        token.role = "Headquarters";
      } else if (roles.includes("1501165906347425872")) {
        token.role = "Whitelisted";
      } else {
        token.role = "Ansökande";
      }
    } catch {
      token.role = "Ansökande";
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.sub;
      session.user.role = token.role;
    }
    return session;
  },
}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };