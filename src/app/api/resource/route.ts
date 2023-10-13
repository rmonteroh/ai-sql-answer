import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const db = await open({
      filename: "./public/Contructions.db",
      driver: sqlite3.Database,
    });
    const data = await db.all("SELECT * FROM resource_assignments");
    return NextResponse.json(data);
  } catch (error) {
    console.log("projects", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


