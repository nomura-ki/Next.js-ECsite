import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const dirPath: string = path.join(process.cwd(), "public", "productImages");

    const folders = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return NextResponse.json({ success: true, data: folders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "internal error" },
      {
        status: 500,
      }
    );
  }
}
