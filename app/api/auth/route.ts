import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));

  const okUser = process.env.ADMIN_USERNAME;
  const okPass = process.env.ADMIN_PASSWORD;

  if (
    username &&
    password &&
    username === okUser &&
    password === okPass
  ) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, createSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  return NextResponse.json({ ok: false, message: "Kredensial salah." }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
