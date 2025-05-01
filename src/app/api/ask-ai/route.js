export const runtime = 'edge';

export async function POST(request) {
  const { question } = await request.json();
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // or "mixtral-8x7b-32768"
        messages: [
          {
            role: "system",
            content: "You are an IPL cricket expert assistant. Provide concise, accurate answers about IPL statistics, players, teams, and match predictions."
          },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (error) {
    return Response.json({ 
      reply: "Error: Failed to get AI response. Please try again later."
    });
  }
}