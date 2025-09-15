import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, files, conversationHistory } = await req.json();

    // Try different AI providers in order of preference
    let response = '';
    
    // First try Gemini
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (geminiKey && !response) {
      try {
        response = await callGemini(message, conversationHistory, geminiKey);
      } catch (error) {
        console.log('Gemini failed, trying OpenAI:', error);
      }
    }

    // Fallback to OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiKey && !response) {
      try {
        response = await callOpenAI(message, conversationHistory, openaiKey);
      } catch (error) {
        console.log('OpenAI failed, trying Anthropic:', error);
      }
    }

    // Fallback to Anthropic Claude
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (anthropicKey && !response) {
      try {
        response = await callClaude(message, conversationHistory, anthropicKey);
      } catch (error) {
        console.log('All AI providers failed:', error);
      }
    }

    if (!response) {
      throw new Error('No AI providers available. Please configure your API keys in the dashboard.');
    }

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process AI request' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callGemini(message: string, history: Message[], apiKey: string): Promise<string> {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are a cybersecurity AI assistant. Help users with cybersecurity questions, analysis, and education. 

Context from conversation:
${history.slice(-5).map(h => `${h.type}: ${h.content}`).join('\n')}

User message: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || 'No response from Gemini';
}

async function callOpenAI(message: string, history: Message[], apiKey: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: 'You are a cybersecurity AI assistant. Help users with cybersecurity questions, analysis, and education.'
    },
    ...history.slice(-10).map(h => ({
      role: h.type === 'user' ? 'user' : 'assistant',
      content: h.content
    })),
    {
      role: 'user',
      content: message
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response from OpenAI';
}

async function callClaude(message: string, history: Message[], apiKey: string): Promise<string> {
  const messages = [
    ...history.slice(-10).map(h => ({
      role: h.type === 'user' ? 'user' : 'assistant',
      content: h.content
    })),
    {
      role: 'user',
      content: message
    }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: 'You are a cybersecurity AI assistant. Help users with cybersecurity questions, analysis, and education.',
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response from Claude';
}