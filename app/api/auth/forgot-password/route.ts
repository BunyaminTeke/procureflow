import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma"; // senin prisma ayarın

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  // 6 haneli random kod üret
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // kodu DB’ye kaydet (10 dakika geçerli)
  await prisma.passwordReset.upsert({
    where: { userId: user.id },
    update: {
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    create: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // mail gönder
  const transporter = nodemailer.createTransport({
    service: "Gmail", // ya da SMTP sunucun
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "🔑 Şifre Sıfırlama Kodu",
  html: `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      <h2 style="color:#1C6EA4; text-align:center;">ProcureFlow</h2>
      <p style="font-size:16px; color:#333;">
        Merhaba <b>${user.name || "Kullanıcı"}</b>,
      </p>
      <p style="font-size:15px; color:#555; line-height:1.5;">
        Şifre sıfırlama talebiniz alındı. Aşağıdaki doğrulama kodunu kullanarak şifrenizi yenileyebilirsiniz:
      </p>
      
      <div style="text-align:center; margin:25px 0;">
        <span style="display:inline-block; background:#1C6EA4; color:#fff; padding:15px 30px; font-size:20px; letter-spacing:3px; border-radius:8px;">
          ${code}
        </span>
      </div>
      
      <p style="font-size:14px; color:#777;">
        Bu kod yalnızca <b>10 dakika</b> geçerlidir. Eğer bu isteği siz yapmadıysanız, lütfen görmezden geliniz.
      </p>
      
      <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
      <p style="font-size:13px; color:#999; text-align:center;">
        © ${new Date().getFullYear()} ProcureFlow. Tüm hakları saklıdır.
      </p>
    </div>
  </div>
  `,
});


  return NextResponse.json({ message: "Kod mail adresinize gönderildi." });
}
