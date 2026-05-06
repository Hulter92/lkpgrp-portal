import { prisma } from "@/lib/prisma";

export async function GET() {
  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(apps);
}