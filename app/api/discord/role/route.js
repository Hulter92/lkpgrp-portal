export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${userId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  const data = await res.json();

  return Response.json(data);
}