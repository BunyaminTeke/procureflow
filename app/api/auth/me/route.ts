// // app/api/auth/me/route.ts
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const SECRET_KEY = process.env.JWT_SECRET!; // .env dosyanda olmalı

// export async function GET(req: Request) {
//   try {
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json({ error: "Token yok" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Token yok" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, SECRET_KEY) as {
//       id: string;
//       email: string;
//       role: string;
//     };

//     // Kullanıcı bilgisini JSON olarak dön
//     return NextResponse.json({
//       id: decoded.id,
//       email: decoded.email,
//       role: decoded.role,
//     });
//   } catch (err) {
//     console.error("Auth/me hatası:", err);
//     return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
//   }
// }


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; // kendi prisma yolunu kullan

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Token yok" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token yok" }, { status: 401 });
    }

    // Token çözülüyor
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
      role: string;
    };

    // Kullanıcı DB’den çekiliyor
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true, // 👈 artık name de geliyor
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Auth/me hatası:", err);
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }
}
