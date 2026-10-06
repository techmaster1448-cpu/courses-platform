# دليل البدء السريع 🚀

هذا الدليل سيساعدك على بدء المشروع بسرعة.

## المتطلبات ✅

قبل البدء، تأكد من تثبيت:
- [Node.js](https://nodejs.org/) (v14 أو أحدث)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

## خطوات البدء السريع ⚡

### 1️⃣ تشغيل MongoDB

```bash
# على Windows
# افتح Power Shell كمسؤول وشغل:
mongod

# أو استخدم MongoDB Atlas (سحابة)
# انسخ connection string في .env
```

### 2️⃣ تشغيل Backend

```bash
# افتح Terminal جديد
cd backend
npm install

# إنشاء البيانات التجريبية
npm run seed

# تشغيل الخادم
npm run dev
```

✅ الخادم الآن يعمل على `http://localhost:5000`

### 3️⃣ تشغيل Frontend

```bash
# افتح Terminal آخر
cd frontend
npm install
npm start
```

✅ التطبيق الآن يعمل على `http://localhost:3000`

## اختبر المشروع 🧪

### دخول الطالب
- البريد: `student@test.com`
- كلمة المرور: `test123`

### دخول المسؤول
- البريد: `admin@test.com`
- كلمة المرور: `admin123`

## الاستكشاف 🔍

### الصفحات الرئيسية
- 🏠 **الرئيسية** - http://localhost:3000/
- 📚 **الدورات** - http://localhost:3000/courses
- 👤 **لوحة الطالب** - http://localhost:3000/student-dashboard
- ⚙️ **لوحة التحكم** - http://localhost:3000/admin-dashboard

### اختبار API Endpoints
استخدم Postman أو Thunder Client:

```bash
# الحصول على الدورات
GET http://localhost:5000/api/courses

# الحصول على الفئات
GET http://localhost:5000/api/categories

# تسجيل دخول
POST http://localhost:5000/api/auth/login
{
  "email": "student@test.com",
  "password": "test123"
}
```

## حل المشاكل الشائعة 🔧

### ❌ "MongoDB connection failed"
- تأكد من تشغيل MongoDB
- تحقق من `MONGODB_URI` في `.env`

### ❌ "Port already in use"
```bash
# تغيير المنفذ في backend/.env
PORT=5001

# أو اقتل العملية
# على Windows (Power Shell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### ❌ "npm: command not found"
- إعد تثبيت Node.js

## نصائح مهمة 💡

- استخدم `npm run dev` للتطوير (يحدث تلقائياً عند التغييرات)
- افتح DevTools في المتصفح (F12) لمراقبة الأخطاء
- جرب إضافة دورات جديدة من لوحة التحكم
- اختبر البحث والتصفية

## الخطوات التالية 📈

بعد البدء السريع، يمكنك:
1. قراءة [README.md](./README.md) للمزيد من التفاصيل
2. دراسة بنية المشروع
3. إضافة ميزات جديدة
4. نشر المشروع

## احتاج للمساعدة؟ 🆘

- اقرأ التعليقات في الكود
- ابحث عن رسائل الخطأ في console
- تحقق من ملف `.env`
- اطلب المساعدة من فريق التطوير

---

**استمتع بالتطوير! 🎉**
