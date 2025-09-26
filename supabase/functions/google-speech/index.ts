import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, text, audio } = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!googleApiKey) {
      throw new Error('Google API key not configured');
    }

    if (action === 'text-to-speech') {
      // Text to Speech
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Standard-D',
            ssmlGender: 'MALE'
          },
          audioConfig: {
            audioEncoding: 'MP3'
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Google TTS API error: ${await response.text()}`);
      }

      const result = await response.json();
      
      return new Response(
        JSON.stringify({ audioContent: result.audioContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'speech-to-text') {
      // Speech to Text
      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
          },
          audio: {
            content: audio
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Google STT API error: ${await response.text()}`);
      }

      const result = await response.json();
      const transcript = result.results?.[0]?.alternatives?.[0]?.transcript || '';
      
      return new Response(
        JSON.stringify({ transcript }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action. Use "text-to-speech" or "speech-to-text"');

  } catch (error) {
    console.error('Google Speech API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});