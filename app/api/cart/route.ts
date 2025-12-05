import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { CartItemWithProduct, formatCartItem } from "@/lib/utils";

export async function GET(req: NextRequest) {
  // TODO: カート取得APIの作成
}

export async function POST(req: NextRequest) {
  // TODO: カート登録APIの作成
}

export async function PUT(req: NextRequest) {
  // TODO: カート更新APIの作成
}

export async function DELETE(req: NextRequest) {
  // TODO: カート削除APIの作成
}
