import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const dirPath = path.join(process.cwd(), "public", "productImages");

    const files: string[] = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith("png") || file.endsWith("jpg"));

    console.log(files);

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
