import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/email";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set.");
  }
  return secret;
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Don't reveal whether email exists (security best practice)
      return NextResponse.json(
        {
          message: "If an account with that email exists, a reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate a reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, type: "password_reset" },
      getJwtSecret(),
      { expiresIn: "1h" }
    );

    // Build reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your Hostel Platform password",
        text: `Hi ${user.fullName},\n\nYou requested to reset your password. Click the link below to set a new password:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\nThanks,\nHostel Platform`,
        html: `<p>Hi ${user.fullName},</p><p>You requested to reset your password. <a href="${resetLink}">Click here to reset it</a>.</p><p>This link expires in 1 hour.</p><p>If you didn't request this, ignore this email.</p><p>Thanks,<br/>Hostel Platform</p>`,
      });
    } catch (emailErr) {
      console.error("Failed sending reset email:", emailErr);
      // Return success anyway - email service might be down but user should still see success message
    }

    return NextResponse.json(
      {
        message: "If an account with that email exists, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
