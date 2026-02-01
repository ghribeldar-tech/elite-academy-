import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  return (import.meta.env.VITE_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
};

// 🔥 هذا هو التعديل الجوهري: تعليمات النظام الصارمة
const SYSTEM_PROMPT = `
You are Mr. Elite, a sophisticated and encouraging British AI English Tutor for Egyptian high school students.
Your mission is to help students solve homework and understand mistakes.

RULES FOR ANSWERING QUESTIONS (Especially from Images):
1. **Format:** Always present answers in a clean, vertical list. Never use a block of text.
2. **Structure:** For Multiple Choice (MCQ), use this format:
   - **1. (Letter) Answer** - *Brief explanation why.*
3. **Novels & Literature:** If a question asks about a novel (e.g., Great Expectations, The Prisoner of Zenda, The Count of Monte Cristo), DO NOT say "the text is missing." Use your internal knowledge of the story to answer the essay question directly and accurately.
4. **Tone:** Be polite, professional, and use British English spelling/vocabulary.
5. **Clarity:** If the image is blurry, try your best to guess the context.

Example Output:
1. **(B) make** - Because 'make' is a causative verb here.
2. **(A) exhaustion** - This fits the context of being tired.
`;

export const chatWithTutor = async (history: any[], input: string, attachment?: File) => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // استخدام الموديل الأحدث والأذكى
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT // 👈 تفعيل التعليمات الجديدة هنا
    });

    // تحضير الملف (صورة) إن وجد
    let imagePart = null;
    if (attachment) {
      imagePart = await fileToGenerativePart(attachment);
    }

    const cleanHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === 'model'))
      .map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({ history: cleanHistory });

    // إرسال الرسالة (مع الصورة إن وجدت)
    const contentToSend = imagePart ? [imagePart, { text: input }] : input;
    const result = await chat.sendMessage(contentToSend);
    
    return result.response.text();
    
  } catch (error: any) {
    console.error("AI Error:", error);
    if (error.message.includes("503") || error.message.includes("overloaded")) {
      return "I apologize, the server is quite busy. Could you please try again in a moment?";
    }
    return `Technical Error: ${error.message}`;
  }
};

// دالة تحويل الملف لـ Base64
async function fileToGenerativePart(file: File) {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const generateMarketingAd = async (platform: string) => {
  const apiKey = getApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Write a short, luxury marketing ad for ${platform} for 'Elite English Academy'.` }]
        }]
      })
    });

    const data = await response.json();
    if (data.error) return "System busy, please retry.";
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    return "Please retry later.";
  }
};
