import { prisma } from "@/lib/prisma";

const GUILD_ID = process.env.DISCORD_GUILD_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const WHITELIST_ROLE = process.env.DISCORD_WHITELIST_ROLE;

export async function POST(req) {
  const { id, status } = await req.json();

  // 🔍 hämta ansökan
  const app = await prisma.application.findUnique({
    where: { id },
  });

  if (!app) {
    return new Response("Not found", { status: 404 });
  }

  // 🎭 om approve → kolla discord först
  if (status === "approved") {
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${app.userId}`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    // ❌ stoppa om inte i servern
    if (memberRes.status !== 200) {
      return Response.json({
        error: "User must join Discord first",
      });
    }

    // ✅ ge whitelist roll
    try {
      await fetch(
        `https://discord.com/api/guilds/${GUILD_ID}/members/${app.userId}/roles/${WHITELIST_ROLE}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bot ${BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Discord error:", err);
    }
  }

  // 💾 uppdatera DB (NU rätt plats)
  await prisma.application.update({
    where: { id },
    data: { status },
  });

  return Response.json({ success: true });
}