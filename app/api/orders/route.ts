import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromReq } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  // TODO: 注文一覧取得APIの作成
}

export async function POST(req: NextRequest) {
  // TODO: 注文登録APIの作成
}
