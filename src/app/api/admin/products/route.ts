import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseProduct(p: { features: string; [key: string]: unknown }) {
  return { ...p, features: JSON.parse(p.features || "[]") };
}

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function GET(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });
      return NextResponse.json(product ? parseProduct(product as unknown as { features: string; [key: string]: unknown }) : null);
    }
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products.map((p) => parseProduct(p as unknown as { features: string; [key: string]: unknown })));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await checkAdmin();
    const body = await req.json();
    const slug = body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        priceIQD: body.priceIQD,
        image: body.image || null,
        categoryId: body.categoryId,
        status: body.status || "IN_STOCK",
        type: body.type || "KEY",
        features: JSON.stringify(body.features || []),
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "معرف المنتج مطلوب" }, { status: 400 });
    }
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.priceIQD !== undefined) updateData.priceIQD = body.priceIQD;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.isVisible !== undefined) updateData.isVisible = body.isVisible;
    if (body.features !== undefined) updateData.features = JSON.stringify(body.features);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

    await prisma.deliveryKey.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "تم الحذف" });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
