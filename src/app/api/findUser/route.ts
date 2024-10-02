import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username"); // Get the username from query parameters

    // Validate if username is provided
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Find user by username
    const findUser = await prisma.user.findUnique({
      where: { username },
      include: { posts: true },
    });

    if (!findUser) {
      return NextResponse.json({ error: `User not found` }, { status: 404 });
    }

    return NextResponse.json(findUser, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
