import { prisma } from "@/lib/prisma";

const GUILD_ID = process.env.DISCORD_GUILD_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// 🎭 map från frontend → discord role

export async function POST(req) {
  const { id, status, roleType } = await req.json();

  // 🔍 hämta ansökan
  const app = await prisma.application.findUnique({
    where: { id },
  });

  if (!app) {
    return new Response("Not found", { status: 404 });
  }

  // 💾 uppdatera DB
  await prisma.application.update({
    where: { id },
    data: { status },
  });

  // 🎭 ge Discord roll om approved
  if (status === "approved") {
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

  return Response.json({ success: true });
}