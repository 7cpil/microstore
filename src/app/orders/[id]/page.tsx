import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import T from "@/components/T";
import TranslatedText from "@/components/TranslatedText";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
          deliveryKey: true,
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const statusBadge: Record<string, string> = {
    PENDING: "badge-yellow",
    PAID: "badge-purple",
    DELIVERED: "badge-green",
    CANCELLED: "badge-red",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2"><T k="orders.detail" /></h1>
      <span className={`badge ${statusBadge[order.status]} mb-6 inline-block`}>
        {order.status === "PENDING" ? <T k="orders.pending" /> :
         order.status === "PAID" ? <T k="orders.paid" /> :
         order.status === "DELIVERED" ? <T k="orders.delivered" /> :
         <T k="orders.cancelled" />}
      </span>

      <div className="card mb-4">
        <h2 className="font-semibold mb-3"><T k="orders.products" /></h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm"><TranslatedText ar={item.product.name} ku={item.product.nameKu} /></div>
                  <div className="text-xs text-[var(--muted)]"><T k="orders.quantity" />: {item.quantity}</div>
                </div>
                <div className="text-sm font-bold">
                  {(item.priceIQDAtPurchase * item.quantity).toLocaleString()} د.ع
                </div>
              </div>
              {item.deliveryKey && (
                <div className="mt-2 p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
                  <div className="text-xs text-[var(--muted)] mb-1"><T k="orders.key" />:</div>
                  <div className="font-mono text-sm font-bold text-[var(--success)] break-all">
                    {item.deliveryKey.value}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]"><T k="orders.paymentMethod" /></span>
          <span><T k="checkout.asiaCell" /></span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]"><T k="orders.date" /></span>
          <span>{new Date(order.createdAt).toLocaleDateString("ar-IQ")}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[var(--border)] font-bold text-lg">
          <span><T k="orders.total" /></span>
          <span className="text-[var(--primary)]">{order.totalIQD.toLocaleString()} د.ع</span>
        </div>
      </div>

      {order.status === "PENDING" && (
        <div className="mt-4 p-4 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/20 text-sm">
          ⏳ <T k="orders.pendingNote" />
        </div>
      )}
    </div>
  );
}
