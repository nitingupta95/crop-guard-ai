import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password strength check
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: user.id, email: user.email },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
  console.error("Signup error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // Prisma unique constraint error
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }
  }

  return NextResponse.json(
    { error: "Internal server error, please try again later" },
    { status: 500 }
  );
}
}
