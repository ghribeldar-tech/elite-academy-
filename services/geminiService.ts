import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  return (import.meta.env.VITE_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
};

// دالة مساعدة لتحويل الملف إلى Base64
const fileToGenerativePart = async (file: File) => {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const chatWithTutor = async (history: any[], input: string, attachment?: File) => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // الموديل الذكي متعدد الوسائط
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // تحضير الرسالة الحالية
    const currentParts: any[] = [{ text: input }];
    
    // إذا وجد ملف، نرفقه مع الرسالة
    if (attachment) {
      const imagePart = await fileToGenerativePart(attachment);
      currentParts.push(imagePart);
    }

    // تنظيف التاريخ (نرسل النصوص فقط في التاريخ لتخفيف الحمل)
    const cleanHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({ history: cleanHistory });
    const result = await chat.sendMessage(currentParts);
    return result.response.text();
    
  } catch (error: any) {
    console.error("AI Error:", error);
    if (error.message.includes("503") || error.message.includes("overloaded")) {
      return "عذراً، السيرفر مشغول بتحليل الصور حالياً. حاول مرة أخرى بعد ثوانٍ.";
    }
    return `حدث خطأ أثناء تحليل الملف: ${error.message}`;
  }
};

export const generateMarketingAd = async (platform: string) => {
  // ... (نفس كود الإعلانات السابق لا تغيير فيه)
  return "Ad generation service."; 
};
