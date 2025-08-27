// // app/api/admin/users/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";

// const prisma = new PrismaClient();

// export async function GET(req: Request) {
//   try {
//     const token = req.headers.get('authorization')?.split(' ')[1];
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
//     if (decoded.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

//     const users = await prisma.user.findMany();
//     return NextResponse.json({ users }, { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Token doğrulama
    let decoded: { id: string; role: string };
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { id: string; role: string };
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Sadece admin erişebilir
    if (decoded.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Kullanıcıları çek
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, department: true },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("GET /admin/users hata:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
