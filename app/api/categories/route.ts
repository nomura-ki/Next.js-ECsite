import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    if (process.env.MOCK_DB_ERROR === "true") {
      throw new Error("Mock DB Error");
    }

    const category = await prisma.category.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "システムエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}
