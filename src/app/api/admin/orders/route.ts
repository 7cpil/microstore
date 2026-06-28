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
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true } },
            deliveryKey: { select: { value: true } },
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(req: Request) {
  try {
    await checkAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }
    const body = await req.json();

    if (body.status === "DELIVERED" || body.status === "PAID") {
      await prisma.order.update({
        where: { id },
        data: { status: body.status },
      });

      if (body.status === "DELIVERED") {
        const order = await prisma.order.findUnique({
          where: { id },
          include: {
            items: {
              where: { deliveryKeyId: null },
              include: { product: true },
            },
          },
        });

        if (order) {
          for (const item of order.items) {
            const availableKey = await prisma.deliveryKey.findFirst({
              where: {
                productId: item.productId,
                isUsed: false,
                orderItem: null,
              },
            });

            if (availableKey) {
              await prisma.deliveryKey.update({
                where: { id: availableKey.id },
                data: {
                  isUsed: true,
                  deliveredAt: new Date(),
                },
              });

              await prisma.orderItem.update({
                where: { id: item.id },
                data: { deliveryKeyId: availableKey.id },
              });
            }
          }
        }
      }
    } else {
      await prisma.order.update({
        where: { id },
        data: { status: body.status },
      });
    }

    return NextResponse.json({ message: "تم التحديث" });
  } catch {
    return NextResponse.json({ error: "فشل" }, { status: 500 });
  }
}
