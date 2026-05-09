export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    const lastMessage = messages[messages.length - 1].content;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'Kamu adalah Ganz AI, asisten AI cerdas dan ramah. Berbicara Bahasa Indonesia santai tapi informatif.' },
          ...messages
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    
    if (reply) return res.json({ content: [{ text: reply }] });
    return res.status(500).json({ error: 'Gagal', detail: data });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
