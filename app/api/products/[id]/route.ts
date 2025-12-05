import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  id?: string;
}

export async function GET(
  req: Request,
  { params }: { params: Params | Promise<Params> }
) {
  // TODO: 商品詳細取得APIの作成
}
