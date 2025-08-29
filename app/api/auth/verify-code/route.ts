import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });

  const reset = await prisma.passwordReset.findUnique({ where: { userId: user.id } });
  if (!reset || reset.code !== code || reset.expiresAt < new Date()) {
    return NextResponse.json({ error: "Kod geçersiz veya süresi dolmuş" }, { status: 400 });
  }
 
  return NextResponse.json({ success: true });
}
