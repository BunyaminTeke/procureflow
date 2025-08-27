// app/api/request/[id]/reject/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // İlgili talep var mı kontrol et
    const request = await prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Talep bulunamadı" },
        { status: 404 }
      );
    }

    // Durumunu "rejected" yap
    const updated = await prisma.request.update({
      where: { id },
      data: { status: "rejected" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Reject hata:", error);
    return NextResponse.json(
      { error: "Talep reddedilirken hata oluştu" },
      { status: 500 }
    );
  }
}
