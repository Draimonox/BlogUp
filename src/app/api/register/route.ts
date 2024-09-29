import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, username, email, password, bio, image } = await req.json();
    if (!email || !password || !username) {
      return NextResponse.json(
        {
          error: `Please do not leave any of the required fields empty`,
        },
        { status: 400 }
      );
    }
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    const createUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hash,
        bio,
        image,
      },
    });
    return NextResponse.json(createUser, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
