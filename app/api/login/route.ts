import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your_random_secret_here";

 
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Create JWT
    let token: string;
    try {
      token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    } catch (jwtError) {
      console.error("JWT signing error:", jwtError);
      return NextResponse.json(
        { error: "Authentication failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 200 }
    );
  }  catch (error: unknown) {
  console.error("Login error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021" || error.code === "P2025") {
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Internal server error. Please try again later." },
    { status: 500 }
  );
}
}
