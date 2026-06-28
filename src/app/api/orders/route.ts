import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendDiscordWebhook } from "@/lib/discord";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
  }

  try {
    const { items, totalIQD, paymentMethod, receiptImage, note } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalIQD,
        paymentMethod,
        receiptImage,
        note,
        status: "PENDING",
        items: {
          create: items.map(
            (item: { productId: string; quantity: number; priceIQD: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceIQDAtPurchase: item.priceIQD,
            })
          ),
        },
      },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    });

    sendDiscordWebhook({
      id: order.id,
      user: { name: session.user.name || "", email: session.user.email || "" },
      totalIQD: order.totalIQD,
      note: order.note,
      items: order.items.map((i) => ({
        product: { name: i.product.name },
        quantity: i.quantity,
        priceIQDAtPurchase: i.priceIQDAtPurchase,
      })),
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 });
  }
}
