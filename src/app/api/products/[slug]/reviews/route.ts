import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  }
  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  }

  const body = await req.json();
  const rating = Math.max(1, Math.min(5, body.rating || 5));
  const comment = body.comment?.trim() || null;

  try {
    const review = await prisma.review.upsert({
      where: { productId_userId: { productId: product.id, userId: session.user.id } },
      update: { rating, comment },
      create: {
        productId: product.id,
        userId: session.user.id,
        rating,
        comment,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إضافة التقييم" }, { status: 500 });
  }
}
