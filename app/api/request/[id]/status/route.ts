import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Durum güncelleme (PATCH)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = body; // APPROVED | REJECTED | PROCURED | COMPLETED

    if (!status) {
      return NextResponse.json({ error: "Durum bilgisi gerekli" }, { status: 400 });
    }

    const updated = await prisma.request.update({
      where: { id: params.id },
      data: { status, updatedAt: new Date() }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Durum güncellenemedi" }, { status: 500 });
  }
}
