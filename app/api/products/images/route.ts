import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { folder } = await req.json();

    if (!folder) {
      return NextResponse.json(
        { success: false, message: "folderを取得できません" },
        { status: 500 }
      );
    }

    const dirPath: string = path.join(
      process.cwd(),
      "public",
      "productImages",
      folder
    );

    const files = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((file) => file.name)
      .map((file) => `${folder}/${file}`)
      .filter((file) => file.endsWith("png") || file.endsWith("jpg"));

    files.sort();

    return NextResponse.json({ success: true, data: files });
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
