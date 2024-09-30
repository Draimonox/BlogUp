import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, username, email, password, bio, image } = await req.json();

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        {
          error: "Please do not leave any of the required fields empty",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    // Create user in the database
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

    // Access JWT secret
    const secret = process.env.SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "JWT secret is not defined" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ id: createUser.id }, secret, { expiresIn: "1h" });

    return NextResponse.json({ user: createUser, token }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
