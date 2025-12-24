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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

    const orderIsExist = await prisma.order.findUnique({
      where: { id },
    });

    const orderItemIsExist = await prisma.orderItem.findFirst({
      where: {
        order_id: id,
      },
    });

    if (!orderIsExist) {
      return NextResponse.json(
        {
          success: false,
          message: "注文がありません",
        },
        { status: 404 }
      );
    } else if (!orderItemIsExist) {
      return NextResponse.json(
        {
          success: false,
          message: "注文商品がありません",
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.orderItem.deleteMany({
        where: {
          order_id: id,
        },
      });

      await prisma.order.delete({
        where: { id },
      });
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "internal error" },
      { status: 500 }
    );
  }
}
