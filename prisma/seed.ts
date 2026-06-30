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
    { name: "Micro", nameKu: "Micro", slug: "micro", icon: "⚡", order: 1 },
    { name: "جيمينج وهاكات", nameKu: "گەیمینگ و هاک", slug: "gaming", icon: "🎮", order: 2 },
    { name: "برامج واشتراكات", nameKu: "پرۆگرام و بەشداربوون", slug: "software", icon: "💻", order: 3 },
    { name: "مونتاج وتصميم", nameKu: "مۆنتاژ و دیزاین", slug: "design", icon: "🎨", order: 4 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameKu: cat.nameKu },
      create: cat,
    });
    createdCategories[cat.slug] = c.id;
    console.log(`  ✅ Category created: ${c.name}`);
  }

  const products = [
    {
      name: "برنامج Micro - الإصدار الأساسی",
      nameKu: "پرۆگرامی Micro - وەشانی بنەڕەتی",
      slug: "micro-basic",
      description: "برنامج ماكرو/أوتو كليكر احترافي لتعزيز أدائك في الألعاب. يدعم جميع الألعاب الشهيرة.",
      descriptionKu: "پرۆگرامی ماکرۆ/ئۆتۆ کلیکی پێشکەوتوو بۆ بەرزکردنەوەی ئاستی یارییەکانت. پشتیوانی هەموو یارییە بەناوبانگەکان دەکات.",
      priceIQD: 15000,
      categorySlug: "micro",
      features: ["ضغطات تلقائية قابلة للتخصيص", "واجهة سهلة الاستخدام", "دعم فني 24 ساعة", "تحديثات مجانية مدى الحياة"],
      featuresKu: ["کرتە ئۆتۆماتیکییەکانی دەتوانیت تایبەت بکەیت", "دەروازەی ئاسان", "پشتیوانی تەکنیکی ٢٤ کاتژمێر", "نوێکردنەوەی بەخۆڕایی بۆ هەمیشە"],
    },
    {
      name: "برنامج Micro - الإصدار المتقدم",
      nameKu: "پرۆگرامی Micro - وەشانی پێشکەوتوو",
      slug: "micro-pro",
      description: "النسخة المتقدمة من Micro مع مميزات إضافية: سكريبتات مخصصة، دعم أجهزة متعددة.",
      descriptionKu: "وەشانی پێشکەوتووی Micro بە تایبەتمەندیی زیاتر: سکریپتی تایبەت، پشتیوانی ئامێری فرە.",
      priceIQD: 25000,
      categorySlug: "micro",
      features: ["كل مميزات الإصدار الأساسي", "سكريبتات مخصصة للألعاب", "دعم أجهزة متعددة", "أولوية في الدعم الفني"],
      featuresKu: ["هەموو تایبەتمەندییەکانی وەشانی بنەڕەتی", "سکریپتی تایبەت بۆ یارییەکان", "پشتیوانی ئامێری فرە", "پێشینە لە پشتیوانی تەکنیکیدا"],
    },
    {
      name: "هاك كاونتر سترايك 2",
      nameKu: "هاکی Counter-Strike 2",
      slug: "cs2-hack",
      description: "هاك متكامل للعبة Counter-Strike 2. وال-هاك، إيم بوت، رادار، وخصائص أخرى.",
      descriptionKu: "هاکی تەواو بۆ یاری Counter-Strike 2. وال-هاک، ئیم بۆت، ڕادار و تایبەتمەندیی تر.",
      priceIQD: 12000,
      categorySlug: "gaming",
      features: ["وال-هاك (ESP)", "إيم بوت (Aimbot)", "رادار", "ضد الحظر لمدة 30 يوم"],
      featuresKu: ["وال-هاک (ESP)", "ئیم بۆت (Aimbot)", "ڕادار", "بەرامبەر بە باند ٣٠ ڕۆژ"],
    },
    {
      name: "هاك فالورانت",
      nameKu: "هاکی Valorant",
      slug: "valorant-hack",
      description: "هاك آمن للعبة Valorant. إيم بوت، وال-هاك، وخصائص متطورة.",
      descriptionKu: "هاکی پارێزراو بۆ یاری Valorant. ئیم بۆت، وال-هاک و تایبەتمەندی پێشکەوتوو.",
      priceIQD: 15000,
      categorySlug: "gaming",
      features: ["إيم بوت قابل للتعديل", "وال-هاك (ESP)", "ضد الحظر", "دعم التحديثات"],
      featuresKu: ["ئیم بۆتی دەستکاری", "وال-هاک (ESP)", "بەرامبەر بە باند", "پشتیوانی نوێکردنەوە"],
    },
    {
      name: "حساب GTA V - 100 مليون",
      nameKu: "ئەکاونتی GTA V - 100 ملیۆن",
      slug: "gta5-account-100m",
      description: "حساب GTA V Online محمل بـ 100 مليون دولار + مستوى عالي.",
      descriptionKu: "ئەکاونتی GTA V Online بارکراو بە 100 ملیۆن دۆلار + ئاستی بەرز.",
      priceIQD: 8000,
      categorySlug: "gaming",
      features: ["100 مليون دولار في اللعبة", "مستوى 100+"],
      featuresKu: ["100 ملیۆن دۆلار لە یارییەکەدا", "ئاستی 100+"],
    },
    {
      name: "تفعيل أدوبي فوتوشوب - سنة",
      nameKu: "چالاککردنی Adobe Photoshop - ساڵ",
      slug: "adobe-photoshop",
      description: "تفعيل سنوي لبرنامج Adobe Photoshop كامل المميزات.",
      descriptionKu: "چالاککردنی ساڵانەی Adobe Photoshop بە هەموو تایبەتمەندییەکان.",
      priceIQD: 5000,
      categorySlug: "software",
      features: ["تفعيل لمدة سنة", "تحديثات مستمرة", "دعم فني"],
      featuresKu: ["چالاککردنی ساڵێک", "نوێکردنەوەی بەردەوام", "پشتیوانی تەکنیکی"],
    },
    {
      name: "نيتفليكس - شهر (شاشة مشتركة)",
      nameKu: "Netflix - مانگ (شاشەی هاوبەش)",
      slug: "netflix-shared",
      description: "شاشة مشتركة في حساب Netflix عائلي لمدة شهر كامل.",
      descriptionKu: "شاشەی هاوبەش لە ئەکاونتی Netflixی خێزانی بۆ ماوەی مانگێک.",
      priceIQD: 3000,
      categorySlug: "software",
      features: ["شهر كامل", "جودة 4K", "حساب خاص"],
      featuresKu: ["مانگێکی تەواو", "کوالێتی 4K", "ئەکاونتی تایبەت"],
    },
    {
      name: "مفتاح ويندوز 11 برو",
      nameKu: "کلیلی Windows 11 Pro",
      slug: "windows-11-pro-key",
      description: "مفتاح تفعيل أصلي لنظام Windows 11 Pro. تفعيل مدى الحياة.",
      descriptionKu: "کلیلی چالاککردنی ڕەسەنی Windows 11 Pro. چالاککردنی بۆ هەمیشە.",
      priceIQD: 7000,
      categorySlug: "software",
      features: ["تفعيل مدى الحياة", "يدعم الترقيات", "ضمان الاستبدال"],
      featuresKu: ["چالاککردنی بۆ هەمیشە", "پشتیوانی بەرزکردنەوە", "زەمانەتی گۆڕینەوە"],
    },
    {
      name: "حزمة تأثيرات مونتاج",
      nameKu: "پاکەتی کاریگەری مۆنتاژ",
      slug: "montage-effects",
      description: "حزمة مؤثرات احترافية لمونتاج الفيديو: ترانزشن، ساوند إفكت، أوفرلاي.",
      descriptionKu: "پاکەتی کاریگەری پێشکەوتوو بۆ مۆنتاژی ڤیدیۆ: ترانزیشن، ساوند ئێفێکت، ئۆڤەرلەی.",
      priceIQD: 4000,
      categorySlug: "design",
      features: ["50+ ترانزشن", "100+ ساوند إفكت", "متوافقة مع Premiere & DaVinci"],
      featuresKu: ["50+ ترانزیشن", "100+ ساوند ئێفێکت", "گونجاو لەگەڵ Premiere & DaVinci"],
    },
    {
      name: "باقة خطوط عربية نادرة",
      nameKu: "پاکەتی فۆنتی عەرەبی دەگمەن",
      slug: "arabic-fonts",
      description: "مجموعة من 30 خط عربي احترافي نادر للتصميم والمونتاج.",
      descriptionKu: "کۆمەڵێک ٣٠ فۆنتی عەرەبی پێشکەوتووی دەگمەن بۆ دیزاین و مۆنتاژ.",
      priceIQD: 3000,
      categorySlug: "design",
      features: ["30 خط عربي", "مناسبة للتصميم والإعلانات", "رخصة تجارية"],
      featuresKu: ["٣٠ فۆنتی عەرەبی", "گونجاو بۆ دیزاین و ڕیکلام", "مۆڵەتی بازرگانی"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { nameKu: product.nameKu, descriptionKu: product.descriptionKu, featuresKu: JSON.stringify(product.featuresKu) },
      create: {
        name: product.name,
        nameKu: product.nameKu,
        slug: product.slug,
        description: product.description,
        descriptionKu: product.descriptionKu,
        priceIQD: product.priceIQD,
        categoryId: createdCategories[product.categorySlug],
        features: JSON.stringify(product.features),
        featuresKu: JSON.stringify(product.featuresKu),
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
