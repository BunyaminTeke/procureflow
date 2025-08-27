import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const total = await prisma.request.count();
  const pending = await prisma.request.count({ where: { status: "PENDING" } });
  const approved = await prisma.request.count({ where: { status: "APPROVED" } });
  const completed = await prisma.request.count({ where: { status: "COMPLETED" } });

  return NextResponse.json({ total, pending, approved, completed });
}
