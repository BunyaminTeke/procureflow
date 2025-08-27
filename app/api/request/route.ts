import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Talepleri listeleme (GET)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const requests = await prisma.request.findMany({
  where: status ? { status: status as any } : {},
  include: {
    employee: {
      select: {
        id: true,
        name: true,
        department: true,
        role: true,
      },
    },
    manager: {
      select: {
        id: true,
        name: true,
        department: true,
        role: true,
      },
    },
    product: true,
  },
  orderBy: { createdAt: "desc" },
});


    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("GET /requests hata:", error);
    return NextResponse.json(
      { error: "Talepler getirilemedi" },
      { status: 500 }
    );
  }
}

// Talep oluşturma (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      employeeId,
      productId,
      itemName,
      category,
      brand,
      quantity,
      priority,
      urgency,
      deliveryDate,
      description,
      department,
      estimatedCost,
      productLink,
      location,
    } = body;

    // Zorunlu alan kontrolü
    if (
      !employeeId ||
      !itemName ||
      !category ||
      !quantity ||
      !deliveryDate ||
      !description ||
      !department ||
      !priority
    ) {
      return NextResponse.json(
        { error: "Eksik bilgi! Zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    const request = await prisma.request.create({
      data: {
        employeeId,
        productId,
        itemName,
        category,
        brand,
        quantity: Number(quantity),
        priority,
        urgency,
        deliveryDate: new Date(deliveryDate),
        description,
        department,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        productLink,
        location,
        status: "pending",
      },
      include: {
        employee: true,
        product: true,
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("POST /request hata:", error);
    return NextResponse.json(
      { error: "Talep oluşturulamadı" },
      { status: 500 }
    );
  }
}
