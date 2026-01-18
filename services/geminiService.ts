export const chatWithTutor = async (history: any[], input: string) => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  
  // الرابط المستقر (v1) بدلاً من التجريبي
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return `DEBUG_ERROR: ${data.error.message}`;
    }

    return data.candidates[0].content.parts[0].text;

  } catch (err: any) {
    return `CONNECTION_FAILED: ${err.message}`;
  }
};
