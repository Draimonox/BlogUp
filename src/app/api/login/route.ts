import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          error: `Please do not leave any fields empty`,
        },
        { status: 400 }
      );
    }

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      return NextResponse.json({ error: `User not found` }, { status: 404 });
    }
    const comparePassowrd = bcrypt.compareSync(password, findUser?.password);
    if (!comparePassowrd) {
      return NextResponse.json({ error: `Invalid password` }, { status: 401 });
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
