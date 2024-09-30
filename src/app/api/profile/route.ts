import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { image, name, posts, username, bio } = await req.json();

    const findUser = await prisma.user.findFirst({
      where: {
        image,
        name,
        posts,
        username,
        bio,
      },
    });

    if (!findUser) {
      return NextResponse.json({ error: `User not found` }, { status: 404 });
    }

    return NextResponse.json(findUser, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
