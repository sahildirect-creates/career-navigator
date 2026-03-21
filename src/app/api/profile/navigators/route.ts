import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const googleId = req.nextUrl.searchParams.get("googleId");
  if (!googleId) {
    return NextResponse.json(
      { error: "Google ID required" },
      { status: 400 }
    );
  }

  try {
    // Get user
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("google_id", googleId)
      .single();

    if (!user) {
      return NextResponse.json({ navigators: [] });
    }

    // Get navigators
    const { data: navigators, error } = await supabaseAdmin
      .from("navigators")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch navigators error:", error);
      return NextResponse.json(
        { error: "Failed to fetch navigators" },
        { status: 500 }
      );
    }

    return NextResponse.json({ navigators });
  } catch (error) {
    console.error("Profile navigators error:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigators" },
      { status: 500 }
    );
  }
}
