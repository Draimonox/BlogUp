import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const image = url.searchParams.get("image");
    const name = url.searchParams.get("name");
    const username = url.searchParams.get("username");
    const bio = url.searchParams.get("bio");

    const findUser = await prisma.user.findMany({
      where: {
        ...(image && { image }),
        ...(name && { name }),
        ...(username && { username }),
        ...(bio && { bio }),
      },
    });

    if (findUser.length === 0) {
      return NextResponse.json({ error: `User not found` }, { status: 404 });
    }

    return NextResponse.json(findUser, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/profile:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
