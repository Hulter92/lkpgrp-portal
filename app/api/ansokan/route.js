import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();

  console.log("DATA IN:", body);

  const app = await prisma.application.create({
    data: {
      userId: body.userId,
      username: body.username,

      fullname: body.fullname,
      birthdate: body.birthdate,
      characterName: body.characterName,
      type: body.type,
      story: body.story,
    },
  });

  return Response.json(app);
}