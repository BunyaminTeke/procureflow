import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, code, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });

  const reset = await prisma.passwordReset.findUnique({ where: { userId: user.id } });
  if (!reset || reset.code !== code || reset.expiresAt < new Date()) {
    return NextResponse.json({ error: "Kod geçersiz" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  // kodu geçersiz hale getir
  await prisma.passwordReset.delete({ where: { userId: user.id } });

  return NextResponse.json({ message: "Şifre başarıyla güncellendi." });
}
