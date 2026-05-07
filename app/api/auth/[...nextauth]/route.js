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
  const userId = token.sub || token.id;
  if (!userId) return token;

  try {
    const res = await fetch(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const data = await res.json();
    const roles = data.roles || [];

    console.log("ROLES:", roles);

    if (roles.includes("1501163659760500868")) {
      token.role = "Headquarters";
    } else if (roles.includes("1501165906347425872")) {
      token.role = "Whitelisted";
    } else {
      token.role = "Ansökande";
    }

  } catch (err) {
    console.error("Discord role error:", err);
    token.role = "Ansökande";
  }

  return token;
}

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
