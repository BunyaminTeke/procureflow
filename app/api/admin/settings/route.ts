import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getToken(req: Request) {
  return req.headers.get("Authorization")?.split(" ")[1];
}

function verifyAdmin(token: string | undefined) {
  if (!token) throw new Error("Unauthorized");
  const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
  if (payload.role !== "ADMIN") throw new Error("Forbidden");
  return payload;
}

// GET ayarları çek
export async function GET(req: Request) {
  try {
    const token = getToken(req);
    verifyAdmin(token);

    const settings = await prisma.adminSettings.findFirst();
    return NextResponse.json(settings || {}, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.message === "Unauthorized" ? 401 : 403 });
  }
}

// PATCH ayarları güncelle
export async function PATCH(req: Request) {
  try {
    const token = getToken(req);
    verifyAdmin(token);

    const body = await req.json();
    const updated = await prisma.adminSettings.upsert({
      where: { id: body.id || "" },
      create: body,
      update: body,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
