import OpenAI from 'openai';

// Debug logging for environment variables
console.log('API Key present:', !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a writing assistant. Transform the input text by writing it backwards."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
      });
      
      // Add debugging
      console.log('OpenAI Request:', {
        model: completion.model,
        messages: completion.messages,
        temperature: completion.temperature
      });


    const remixedText = completion.choices[0].message.content;

    return new Response(JSON.stringify({ result: remixedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to remix text',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 