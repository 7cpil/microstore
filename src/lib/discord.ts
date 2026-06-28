export async function sendDiscordWebhook(
  order: {
    id: string;
    user: { name: string; email: string };
    totalIQD: number;
    note: string | null;
    items: { product: { name: string }; quantity: number; priceIQDAtPurchase: number }[];
  }
) {
  const webhookUrl =
    process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) return;

  const itemsList = order.items
    .map(
      (i) =>
        `**${i.product.name}** × ${i.quantity} — ${(
          i.priceIQDAtPurchase * i.quantity
        ).toLocaleString()} د.ع`
    )
    .join("\n");

  const embed = {
    title: "🛒 طلب جديد",
    color: 0x8b5cf6,
    fields: [
      { name: "👤 الزبون", value: `${order.user.name} (${order.user.email})`, inline: true },
      { name: "💵 المجموع", value: `${order.totalIQD.toLocaleString()} د.ع`, inline: true },
      { name: "📝 ملاحظة", value: order.note || "بدون ملاحظة", inline: false },
      { name: "📦 المنتجات", value: itemsList || "لا يوجد", inline: false },
    ],
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch {
    // fail silently
  }
}
