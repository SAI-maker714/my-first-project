const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { state } = await req.json();

    if (!state) {
      return new Response(
        JSON.stringify({ error: 'State is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `You are a travel expert for India. Provide detailed travel information for ${state}, India. Return a JSON object with this exact structure:
{
  "overview": "A 2-3 sentence overview of the state/destination",
  "places": [
    {"name": "Place Name", "description": "Brief description", "best_time": "Best months to visit", "image_query": "specific landmark or scenic photo search term for Unsplash"}
  ],
  "itinerary": [
    {"day": 1, "activities": ["Morning: Activity 1", "Afternoon: Activity 2", "Evening: Activity 3"]}
  ],
  "hotels": [
    {"name": "Hotel Name", "type": "Budget/Mid-range/Luxury", "price_range": "₹1000-2000/night", "image_query": "hotel exterior or lobby search term for Unsplash", "rating": 4.2}
  ],
  "transport": {
    "flights": "Major airports and airlines info",
    "trains": "Key railway stations and popular trains",
    "buses": "State transport and private bus services",
    "cars": "Self-drive and rental options with approximate costs"
  },
  "budget": {
    "budget_per_day": {"accommodation": 800, "food": 500, "transport": 400, "activities": 300, "misc": 200},
    "midrange_per_day": {"accommodation": 2500, "food": 1200, "transport": 800, "activities": 600, "misc": 400},
    "luxury_per_day": {"accommodation": 8000, "food": 3000, "transport": 2000, "activities": 1500, "misc": 1000}
  }
}
Include 5-6 places, 3-4 day itinerary, 4-5 hotels across budget ranges, and detailed transport info. For image_query fields, use specific real landmark names or descriptive terms that would return good photos on Unsplash. Return ONLY valid JSON, no markdown.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a travel expert. Return only valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API error:', errText);
      return new Response(
        JSON.stringify({ error: 'AI service unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      // Strip markdown fences and any leading/trailing non-JSON content
      let jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      // Find the first { and last } to extract JSON object
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', content.substring(0, 500));
      return new Response(
        JSON.stringify({ error: 'Failed to parse destination data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
