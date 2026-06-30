import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "الرمز وكلمة السر مطلوبان" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة السر يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "الرمز غير صالح أو منتهي الصلاحية" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashed },
    });

    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return NextResponse.json({ message: "تم تغيير كلمة السر بنجاح" });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
