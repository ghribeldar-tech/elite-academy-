// Final Reset Build - Version 3.0
export const chatWithTutor = async (history: any[], input: string) => {
  try {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    // السطر ده هو اللي هيعرفنا هل المفتاح الجديد (B7Q) وصل ولا لأ
    const keyHint = apiKey ? apiKey.slice(-4) : "NONE";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "You are Mr. Elite AI." }] },
          { role: "model", parts: [{ text: "Ready." }] },
          { role: "user", parts: [{ text: input }] }
        ]
      })
    });

    const data = await response.json();
    if (data.error) return `خطأ من جوجل [المفتاح الحالي: ${keyHint}]: ${data.error.message}`;
    if (data.candidates) return data.candidates[0].content.parts[0].text;
    return "لا يوجد رد.";
  } catch (err: any) {
    return `فشل: ${err.message}`;
  }
};
