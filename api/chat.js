export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  const contents = [
    { role: 'user', parts: [{ text: 'Kamu adalah Ganz AI, asisten AI cerdas dan ramah. Berbicara Bahasa Indonesia santai tapi informatif. Dibuat oleh tim Ganz.' }] },
    { role: 'model', parts: [{ text: 'Oke siap!' }] },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 1000, temperature: 0.7 } })
    }
  );

  const data = await response.json();

  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return res.json({ content: [{ text: data.candidates[0].content.parts[0].text }] });
  }

  return res.status(500).json({ error: 'Gagal', detail: data });
}
