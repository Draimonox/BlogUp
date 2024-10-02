import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content, authorId } = await req.json();

    const postBlog = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    if (!postBlog) {
      return NextResponse.json({ error: `User not found` }, { status: 404 });
    }

    return NextResponse.json(postBlog, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const authorId = url.searchParams.get("authorId");

    if (!authorId) {
      return NextResponse.json(
        { error: "Author ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ username: user.username }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
