import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: navigator, error } = await supabaseAdmin
      .from("navigators")
      .select("*")
      .eq("public_slug", params.slug)
      .eq("is_public", true)
      .single();

    if (error || !navigator) {
      return NextResponse.json(
        { error: "Navigator not found or not public" },
        { status: 404 }
      );
    }

    return NextResponse.json({ navigator });
  } catch (error) {
    console.error("Fetch navigator error:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigator" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from("navigators")
      .update({ is_public: true })
      .eq("public_slug", params.slug)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to make navigator public" },
        { status: 500 }
      );
    }

    return NextResponse.json({ navigator: data });
  } catch (error) {
    console.error("Update navigator error:", error);
    return NextResponse.json(
      { error: "Failed to update navigator" },
      { status: 500 }
    );
  }
}
