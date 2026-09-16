# Telegram Todo Mini App 🤱

یک Mini App تلگرام برای مدیریت کارها، ساخته شده با Next.js و Supabase.

## راه‌اندازی

### ۱. ساخت ربات تلگرام
به [@BotFather](https://t.me/BotFather) پیام بده و `TELEGRAM_BOT_TOKEN` بگیر.

### ۲. ساخت Mini App
توی @BotFather:
```
/newapp
```
آدرس سایتت رو بده (مثلاً `https://your-domain.vercel.app`).

### ۳. ساخت پروژه Supabase
- توی [supabase.com](https://supabase.com) یه پروژه بساز
- `schema.sql` رو در SQL Editor اجرا کن
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` رو از Settings > API بگیر

### ۴. تنظیم .env
```bash
cp .env.example .env
# مقادیر واقعی رو پر کن
```

### ۵. اجرا
```bash
npm run dev     # توسعه
npm run build   # بیلد
npm run start   # اجرا
```

### ۶. Docker
```bash
docker compose up --build
```

## ساختار پروژه

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # صفحه اصلی
│   ├── globals.css               # Tailwind styles
│   └── api/tasks/                # API routes
│       ├── route.ts              # GET / POST
│       └── [id]/route.ts         # PATCH / DELETE
├── components/
│   ├── TaskList.tsx              # لیست تسک‌ها
│   └── BackButton.tsx            # دکمه بازگشت تلگرام
├── hooks/
│   ├── useTasks.ts               # منطق CRUD تسک‌ها
│   ├── useTelegramUser.ts        # اطلاعات کاربر تلگرام
│   └── useMainButton.ts          # کنترل MainButton
├── lib/
│   ├── supabase/                 # کلاینت‌های Supabase
│   │   ├── client.ts             # سمت مرورگر
│   │   └── server.ts             # سمت سرور (service role)
│   ├── telegram.ts               # اعتبارسنجی initData
│   └── types.ts                  # تایپ‌ها
└── services/
    └── taskService.ts            # منطق CRUD
```

## امنیت
- `initData` تلگرام در سرور با HMAC-SHA256 اعتبارسنجی می‌شود
- کلید service-role فقط در سمت سرور استفاده می‌شود
- تمام API endpoints نیاز به `x-telegram-init-data` معتبر دارند
