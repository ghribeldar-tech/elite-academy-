/// <reference types="vite/client" />

interface ImportMetaEnv {
  // تعريف المفتاح الذي استخدمناه في Vercel والكود
  readonly VITE_KEY: string;
  // يمكنك إضافة أي مفاتيح أخرى هنا مستقبلاً
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
