import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  // 🔒 1. kolla session
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 🔒 2. hämta Discord roller
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/discord/role?userId=${session.user.id}`
  );

  const data = await res.json();
  const roles = data.roles || [];

  // 🔒 3. kolla admin roll
  const isAdmin = roles.includes("1501163659760500868");

  if (!isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  // ✅ 4. hämta data
  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(apps);
}