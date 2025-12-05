import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyToken, getUserFromReq } from "@/lib/auth";
import { saveFiles } from "@/lib/utils";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  // TODO: 商品一覧取得APIの作成
}

export async function POST(req: NextRequest) {
  // TODO: 商品登録APIの作成
}

export async function PUT(req: NextRequest) {
  // TODO: 商品更新APIの作成
}

export async function DELETE(req: NextRequest) {
  // TODO: 商品削除APIの作成
}
