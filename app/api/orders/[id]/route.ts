import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  id?: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  // TODO: 注文詳細取得APIの作成
  try {
    const { id } = await params;

    const orderItem = await prisma.orderItem.findMany({
      where: {
        order_id: id,
      },
      select: {
        id: true,
        order_id: true,
        product_id: true,
        product: {
          select: {
            name: true,
            price: true,
          },
        },
        quantity: true,
        price: true,
        created_at: true,
      },
    });

    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        order,
        orderItem,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "internal error" },
      { status: 500 }
    );
  }
}
