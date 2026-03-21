import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { geminiPro } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await req.json();

    if (!role || typeof role !== "string" || role.trim().length === 0) {
      return NextResponse.json(
        { error: "Role title is required" },
        { status: 400 }
      );
    }

    // Normalize role: trim, title-case, collapse whitespace for consistent results
    const normalizedRole = role
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    const systemPrompt = `You are a career roadmap expert. Create a step-by-step learning and career progression roadmap for someone who wants to become a ${normalizedRole}. Return a JSON object with:
* "nodes": array of roadmap steps, each with: id, label (step name), description (1 sentence), type (one of: foundation, skill, milestone, goal), estimatedTime (e.g. "2-3 months")
* "edges": array of connections between nodes as {source: id, target: id}
* "resources": array of 8-10 learning resources for this role, each with: title, url, type (course/book/community/tool/video), platform, free (boolean), and forNodes (array of node ids this resource helps with, e.g. ["1", "2"])
Make the roadmap practical and specific, 8-12 nodes total. Start from absolute beginner and go to job-ready. Every resource MUST have a forNodes array linking it to 1-3 relevant roadmap step ids. IMPORTANT: Every roadmap node must have at least one free resource (free: true) linked to it — ensure no step is left without a free learning option.

CONSISTENCY RULES — follow these exactly for every request:
- Node labels must NOT include the type prefix (e.g. use "Python Programming" not "Foundation: Python Programming")
- Always produce exactly 10 nodes and exactly 10 resources
- Always use this node structure: 2 foundation → 4 skill → 2 milestone → 1 skill → 1 goal
- Arrange nodes in 3 rows: row 1 (foundation+first skill), row 2 (skills), row 3 (milestone+skill+goal)
- Node IDs must be sequential strings "1" through "10"

Return ONLY valid JSON, no markdown, no code blocks. The format must be:
{
  "nodes": [
    {
      "id": "1",
      "label": "Step Name",
      "description": "One sentence description.",
      "type": "foundation",
      "estimatedTime": "2-3 months"
    }
  ],
  "edges": [
    { "source": "1", "target": "2" }
  ],
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://example.com",
      "type": "course",
      "platform": "Platform Name",
      "free": true,
      "forNodes": ["1", "2"]
    }
  ]
}`;

    const result = await geminiPro.generateContent({
      contents: [{ role: "user", parts: [
        { text: systemPrompt },
        { text: `Create a career roadmap for: ${normalizedRole}` },
      ]}],
      generationConfig: { temperature: 0.2 },
    });

    const responseText = result.response.text();

    let roadmap;
    try {
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      roadmap = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Validate structure
    if (!roadmap.nodes || !roadmap.edges || !roadmap.resources) {
      return NextResponse.json(
        { error: "Incomplete AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(roadmap);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Navigator API error:", errMsg, error);
    return NextResponse.json(
      { error: `Failed to generate roadmap: ${errMsg}` },
      { status: 500 }
    );
  }
}
