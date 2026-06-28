export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function GET() {
  try {
    await checkAdmin();
    const keys = await prisma.deliveryKey.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    });
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ keys, products });
  } catch {
    return NextResponse.json({ keys: [], products: [] });
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const key = await prisma.deliveryKey.create({
      data: {
        productId: body.productId,
        value: body.value,
      },
    });
    return NextResponse.json(key, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });
    await prisma.deliveryKey.delete({ where: { id } });
    return NextResponse.json({ message: "تم" });
  } catch {
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}
