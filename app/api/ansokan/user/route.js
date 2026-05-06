import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const app = await prisma.application.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(app);
}