import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const db = await open({
      filename: "./public/Contructions.db",
      driver: sqlite3.Database,
    });
    const tasks = await db.all("SELECT * FROM tasks");
    return NextResponse.json(tasks);
  } catch (error) {
    console.log("projects", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


