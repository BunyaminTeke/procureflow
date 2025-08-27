// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { name, email, password } = body;

//   if (!name || !email || !password) {
//     return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     });
//     return NextResponse.json({ message: 'User created', userId: user.id }, { status: 201 });
//   } catch (error: any) {
//     if (error.code === 'P2002') {
//       return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
//     }
//     return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
//   }
// }




// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const { name, email, department, password } = await req.json();

//     if (!name || !email || !department || !password) {
//       return NextResponse.json({ error: "Eksik alan var" }, { status: 400 });
//     }

//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) {
//       return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.user.create({
//       data: { name, email, department, password: hashedPassword },
//     });

//     return NextResponse.json({ message: "Kayıt başarılı" }, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
//   }
// }


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

    return NextResponse.json({ message: "Kayıt başarılı" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

