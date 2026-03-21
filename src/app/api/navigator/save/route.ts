import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.googleId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { roleTitle, mode, ikigaiInput, roadmapJson, resourcesJson } =
      await req.json();

    // Get user from Supabase
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("google_id", session.user.googleId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const publicSlug = uuidv4().slice(0, 8);

    const { data: navigator, error } = await supabaseAdmin
      .from("navigators")
      .insert({
        user_id: user.id,
        role_title: roleTitle,
        mode,
        ikigai_input: ikigaiInput || null,
        roadmap_json: roadmapJson,
        resources_json: resourcesJson,
        public_slug: publicSlug,
        is_public: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save navigator" },
        { status: 500 }
      );
    }

    return NextResponse.json({ navigator });
  } catch (error) {
    console.error("Save navigator error:", error);
    return NextResponse.json(
      { error: "Failed to save navigator" },
      { status: 500 }
    );
  }
}
