import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req: Request) {
  try {
    // TODO: クッキーとDBからtokenを削除する
  } catch (error) {
    console.error(error);
    return errorResponse("サーバーエラー");
  }
}
