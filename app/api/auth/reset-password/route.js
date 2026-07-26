import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }
  return secret;
}

function validatePassword(password) {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required." },
        { status: 400 }
      );
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired reset link." },
        { status: 400 }
      );
    }

    if (decoded.type !== "password_reset") {
      return NextResponse.json(
        { error: "Invalid reset token." },
        { status: 400 }
      );
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json(
        { error: passwordError },
        { status: 400 }
      );
    }

    // Update user password
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { passwordHash: hashPassword(password) },
    });

    return NextResponse.json(
      {
        message: "Password reset successfully.",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    if (err?.code === "P2025") {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
