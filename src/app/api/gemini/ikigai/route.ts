import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { geminiFlash } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a career alignment expert. A user has described what feels like them in life. Analyze their input and return exactly 5 relevant career roles that align with their description. For each role return: title, one-line description (max 15 words), why it fits them (2 sentences), average salary range (India + Global), and growth outlook (one word: High/Medium/Explosive). Return as JSON array.

Return ONLY valid JSON, no markdown, no code blocks. The format must be:
[
  {
    "title": "Role Title",
    "description": "One-line description max 15 words",
    "fitReason": "Two sentences explaining why this fits them.",
    "salary": {
      "india": "₹X-Y LPA",
      "global": "$X-Y/year"
    },
    "growth": "High"
  }
]`;

    const result = await geminiFlash.generateContent({
      contents: [{ role: "user", parts: [
        { text: systemPrompt },
        { text: `User input: ${input}` },
      ]}],
      generationConfig: { temperature: 0.3 },
    });

    const responseText = result.response.text();

    // Try to parse JSON from the response
    let roles;
    try {
      // Remove potential markdown code blocks
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      roles = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Ikigai API error:", error);
    return NextResponse.json(
      { error: "Failed to generate roles. Please try again." },
      { status: 500 }
    );
  }
}
