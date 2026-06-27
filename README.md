# Micro Store 🛒

متجر إلكتروني للمنتجات الرقمية مبني بـ Next.js.

## التقنيات
- Next.js 16 + TypeScript
- PostgreSQL + Prisma ORM
- TailwindCSS
- NextAuth.js
- RTL + Dark Mode

## النشر على Render

### 1. ارفع المشروع على GitHub
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/microstore.git
git push -u origin main
```

### 2. أنشئ Web Service على Render
1. ادخل [Render.com](https://render.com) وسجل بحساب GitHub
2. اضغط **New +** → **Web Service**
3. اختر مستودع `microstore`
4. املأ البيانات:
   - **Name:** `microstore`
   - **Runtime:** `Node`
   - **Build Command:** `npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. في **Environment Variables** أضف:
   - `NEXTAUTH_URL` = رابط موقعك (مثلاً `https://microstore.onrender.com`)
   - `NEXTAUTH_SECRET` = (قيمة عشوائية طويلة)

### 3. أنشئ PostgreSQL Database
1. في نفس صفحة Render، اذهب إلى Dashboard → **New +** → **PostgreSQL**
2. اختر **Free** plan
3. بعد الإنشاء، انسخ `Internal Database URL`
4. أضفه كـ `DATABASE_URL` في Environment Variables للـ Web Service

### 4. شغل السيـد (Seed)
بعد أول نشر، شغل هذا في Render Shell:
```bash
npx prisma db push
npx prisma db seed
```

### 5. UptimeRobot (لمنع النوم)
1. سجل في [UptimeRobot](https://uptimerobot.com)
2. أضف Monitor جديد
3. الرابط: `https://microstore.onrender.com`
4. وقت الفحص: كل 5 دقائق

## بيانات الدخول الابتدائية
- **أدمن:** admin@microstore.com / admin123
- **مستخدم تجريبي:** test@test.com / test123

## التطوير محلياً
```bash
npm install
npm run dev
```
