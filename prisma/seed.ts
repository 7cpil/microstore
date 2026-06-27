import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@microstore.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@microstore.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`  ✅ Admin user created: ${admin.email}`);

  const categories = [
    { name: "Micro", slug: "micro", icon: "⚡", order: 1 },
    { name: "جيمينج وهاكات", slug: "gaming", icon: "🎮", order: 2 },
    { name: "برامج واشتراكات", slug: "software", icon: "💻", order: 3 },
    { name: "مونتاج وتصميم", slug: "design", icon: "🎨", order: 4 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c.id;
    console.log(`  ✅ Category created: ${c.name}`);
  }

  const products = [
    {
      name: "برنامج Micro - الإصدار الأساسي",
      slug: "micro-basic",
      description: "برنامج ماكرو/أوتو كليكر احترافي لتعزيز أدائك في الألعاب. يدعم جميع الألعاب الشهيرة.",
      priceIQD: 15000,
      categorySlug: "micro",
      features: ["ضغطات تلقائية قابلة للتخصيص", "واجهة سهلة الاستخدام", "دعم فني 24 ساعة", "تحديثات مجانية مدى الحياة"],
    },
    {
      name: "برنامج Micro - الإصدار المتقدم",
      slug: "micro-pro",
      description: "النسخة المتقدمة من Micro مع مميزات إضافية: سكريبتات مخصصة، دعم أجهزة متعددة.",
      priceIQD: 25000,
      categorySlug: "micro",
      features: ["كل مميزات الإصدار الأساسي", "سكريبتات مخصصة للألعاب", "دعم أجهزة متعددة", "أولوية في الدعم الفني"],
    },
    {
      name: "هاك كاونتر سترايك 2",
      slug: "cs2-hack",
      description: "هاك متكامل للعبة Counter-Strike 2. وال-هاك، إيم بوت، رادار، وخصائص أخرى.",
      priceIQD: 12000,
      categorySlug: "gaming",
      features: ["وال-هاك (ESP)", "إيم بوت (Aimbot)", "رادار", "ضد الحظر لمدة 30 يوم"],
    },
    {
      name: "هاك فالورانت",
      slug: "valorant-hack",
      description: "هاك آمن للعبة Valorant. إيم بوت، وال-هاك، وخصائص متطورة.",
      priceIQD: 15000,
      categorySlug: "gaming",
      features: ["إيم بوت قابل للتعديل", "وال-هاك (ESP)", "ضد الحظر", "دعم التحديثات"],
    },
    {
      name: "حساب GTA V - 100 مليون",
      slug: "gta5-account-100m",
      description: "حساب GTA V Online محمل بـ 100 مليون دولار + مستوى عالي.",
      priceIQD: 8000,
      categorySlug: "gaming",
      features: ["100 مليون دولار في اللعبة", "مستوى 100+"],
    },
    {
      name: "تفعيل أدوبي فوتوشوب - سنة",
      slug: "adobe-photoshop",
      description: "تفعيل سنوي لبرنامج Adobe Photoshop كامل المميزات.",
      priceIQD: 5000,
      categorySlug: "software",
      features: ["تفعيل لمدة سنة", "تحديثات مستمرة", "دعم فني"],
    },
    {
      name: "نيتفليكس - شهر (شاشة مشتركة)",
      slug: "netflix-shared",
      description: "شاشة مشتركة في حساب Netflix عائلي لمدة شهر كامل.",
      priceIQD: 3000,
      categorySlug: "software",
      features: ["شهر كامل", "جودة 4K", "حساب خاص"],
    },
    {
      name: "مفتاح ويندوز 11 برو",
      slug: "windows-11-pro-key",
      description: "مفتاح تفعيل أصلي لنظام Windows 11 Pro. تفعيل مدى الحياة.",
      priceIQD: 7000,
      categorySlug: "software",
      features: ["تفعيل مدى الحياة", "يدعم الترقيات", "ضمان الاستبدال"],
    },
    {
      name: "حزمة تأثيرات مونتاج",
      slug: "montage-effects",
      description: "حزمة مؤثرات احترافية لمونتاج الفيديو: ترانزشن، ساوند إفكت، أوفرلاي.",
      priceIQD: 4000,
      categorySlug: "design",
      features: ["50+ ترانزشن", "100+ ساوند إفكت", "متوافقة مع Premiere & DaVinci"],
    },
    {
      name: "باقة خطوط عربية نادرة",
      slug: "arabic-fonts",
      description: "مجموعة من 30 خط عربي احترافي نادر للتصميم والمونتاج.",
      priceIQD: 3000,
      categorySlug: "design",
      features: ["30 خط عربي", "مناسبة للتصميم والإعلانات", "رخصة تجارية"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceIQD: product.priceIQD,
        categoryId: createdCategories[product.categorySlug],
        features: JSON.stringify(product.features),
      },
    });
    console.log(`  ✅ Product created: ${product.name}`);
  }

  const testUserPassword = await bcrypt.hash("test123", 12);
  await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@test.com",
      password: testUserPassword,
      role: "USER",
    },
  });
  console.log("  ✅ Test user created: test@test.com / test123");

  const settings = [
    { key: "usd_rate", value: "1310" },
    { key: "sar_rate", value: "349" },
    { key: "contact_discord", value: "https://discord.gg/DjkMF3dcZ" },
    { key: "contact_whatsapp", value: "07721830415" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
    console.log(`  ✅ Setting: ${s.key} = ${s.value}`);
  }

  console.log("\n🎉 Seed completed!");
  console.log("📧 Admin: admin@microstore.com / admin123");
  console.log("📧 Test:  test@test.com / test123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
