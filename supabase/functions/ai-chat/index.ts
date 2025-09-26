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
  console.log('AI Chat function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Request body received');
    
    const { message, files = [], conversationHistory = [] } = requestBody;
    
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }
    
    console.log('Processing AI request for message:', message.substring(0, 50));

    // Check available API keys
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    console.log('Available keys:', {
      gemini: !!geminiKey,
      openai: !!openaiKey,
      anthropic: !!anthropicKey
    });

    if (!geminiKey && !openaiKey && !anthropicKey) {
      throw new Error('No AI API keys configured. Please add GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY in Supabase Edge Function Secrets.');
    }

    // Try different AI providers in order of preference
    let response = '';
    let lastError = null;
    
    // First try Gemini
    if (geminiKey && !response) {
      try {
        console.log('Trying Gemini API...');
        response = await callGemini(message, conversationHistory, geminiKey);
        console.log('Gemini API successful, response length:', response.length);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Gemini failed:', errorMsg);
        lastError = error;
      }
    }

    // Fallback to OpenAI
    if (openaiKey && !response) {
      try {
        console.log('Trying OpenAI API...');
        response = await callOpenAI(message, conversationHistory, openaiKey);
        console.log('OpenAI API successful, response length:', response.length);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('OpenAI failed:', errorMsg);
        lastError = error;
      }
    }

    // Fallback to Anthropic Claude
    if (anthropicKey && !response) {
      try {
        console.log('Trying Anthropic API...');
        response = await callClaude(message, conversationHistory, anthropicKey);
        console.log('Anthropic API successful, response length:', response.length);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Anthropic failed:', errorMsg);
        lastError = error;
      }
    }

    if (!response) {
      const errorMsg = lastError instanceof Error
        ? `All AI providers failed. Last error: ${lastError.message}`
        : 'No AI API keys are configured. Please add GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY in Supabase Edge Function Secrets.';
      throw new Error(errorMsg);
    }

    console.log('Returning successful response');
    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to process AI request';
    return new Response(JSON.stringify({ 
      error: errorMsg 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callGemini(message: string, history: Message[], apiKey: string): Promise<string> {
  console.log('Calling Gemini with API key length:', apiKey?.length || 0);
  
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Invalid Gemini API key');
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `You are MR.Yassen, a cybersecurity AI assistant. Help users with cybersecurity questions, analysis, and education. 

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
  };

  console.log('Sending request to Gemini API');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('Gemini API response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error response:', errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Gemini API response received');
  
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    console.error('No content in Gemini response:', JSON.stringify(data));
    throw new Error('No content received from Gemini');
  }
  
  return content;
}

async function callOpenAI(message: string, history: Message[], apiKey: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: 'You are MR.Yassen, a cybersecurity AI assistant. Help users with cybersecurity questions, analysis, and education.'
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
      system: 'You are MR.Yassen, a cybersecurity AI assistant. Help users with cybersecurity questions, analysis, and education.',
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response from Claude';
}