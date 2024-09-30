import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

    console.log("Email:", email);

    // Normalize email
    const normalizedEmail = email.toLowerCase();
    const findUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
      },
    });

    console.log("Found User:", findUser);

    if (!findUser) {
      return NextResponse.json({ error: `User not found` }, { status: 404 });
    }

    const comparePassword = bcrypt.compareSync(password, findUser?.password);
    if (!comparePassword) {
      return NextResponse.json({ error: `Invalid password` }, { status: 401 });
    }

    const secret = process.env.SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "JWT secret is not defined" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ id: findUser.id }, secret, { expiresIn: "1h" });
    return NextResponse.json({ findUser, token }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
