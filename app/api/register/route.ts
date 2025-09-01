import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, department, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Eksik alan var" }, { status: 400 });
    }

    // Email kontrolü
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 400 });
    }

    // Şifre hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    await prisma.user.create({
      data: { 
        name, 
        email, 
        department, 
        password: hashedPassword,
        role: role || "EMPLOYEE" // default: EMPLOYEE
      },
    });

    return NextResponse.json({ success: true, message: "Kayıt başarılı" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
