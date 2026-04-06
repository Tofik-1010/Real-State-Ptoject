import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences, properties } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a real estate expert AI assistant for PropNest, an Indian real estate platform. 
You help users find the best property based on their preferences.

Given the user's preferences and a list of available properties, you must:
1. Analyze which properties best match their needs
2. Provide a detailed analysis explaining WHY each recommendation is good
3. Consider factors like value for money, location advantages, amenities, and investment potential
4. Use Indian real estate terminology (Vastu, RERA, carpet area, etc.)
5. Be specific about each property's strengths

Return your response as JSON with this structure:
{
  "analysis": "Your detailed markdown analysis (use bold, bullet points, etc.)",
  "recommendedIds": ["id1", "id2", "id3"]
}

IMPORTANT: recommendedIds must be actual IDs from the property list. Pick the top 3 matches.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `User Preferences: ${preferences}\n\nAvailable Properties:\n${properties}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "recommend_properties",
                description:
                  "Return property recommendations with analysis",
                parameters: {
                  type: "object",
                  properties: {
                    analysis: {
                      type: "string",
                      description:
                        "Detailed markdown analysis of recommendations",
                    },
                    recommendedIds: {
                      type: "array",
                      items: { type: "string" },
                      description: "Array of recommended property IDs",
                    },
                  },
                  required: ["analysis", "recommendedIds"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "recommend_properties" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse content as JSON
    const content = data.choices?.[0]?.message?.content || "";
    try {
      const parsed = JSON.parse(content);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(
        JSON.stringify({ analysis: content, recommendedIds: [] }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (e) {
    console.error("ai-recommend error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
