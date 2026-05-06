import { prisma } from "@/lib/prisma";

const GUILD_ID = process.env.DISCORD_GUILD_ID;
const ROLE_ID = process.env.DISCORD_WHITELIST_ROLE;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function POST(req) {
  const { id, action, userId } = await req.json();

  // Uppdatera DB
  await prisma.application.update({
    where: { id },
    data: { status: action },
  });

  // Om approve → ge Discord roll
  if (action === "approved") {
    await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${userId}/roles/${ROLE_ID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );
  }

  return Response.json({ success: true });
}