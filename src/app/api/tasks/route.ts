import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const {data} = await supabase.from("tasks").select().order("task_id", { ascending: true });
    return NextResponse.json(data);
  } catch (error) {
    console.log("projects", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


