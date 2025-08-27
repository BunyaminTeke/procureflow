// // app/api/login/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "E-posta ve şifre gerekli" },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return NextResponse.json(
//         { error: "Kullanıcı bulunamadı" },
//         { status: 404 }
//       );
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return NextResponse.json(
//         { error: "Hatalı şifre" },
//         { status: 401 }
//       );
//     }

    
// const token = jwt.sign(
//   { id: user.id, email: user.email, role: user.role }, // <- role eklendi
//   process.env.JWT_SECRET as string,
//   { expiresIn: "24h" } // Burada sorun olabilir
// );

// // Response'da role gönderiyoruz
// return NextResponse.json(
//   { message: "Giriş başarılı", token, role: user.role }, // <- role burada
//   { status: 200 }
// );

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Sunucu hatası" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre gerekli" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // ✅ isActive kontrolü
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Hesap devre dışı bırakılmış" },
        { status: 403 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Hatalı şifre" },
        { status: 401 }
      );
    }

    // JWT üret
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      { message: "Giriş başarılı", token, role: user.role },
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
