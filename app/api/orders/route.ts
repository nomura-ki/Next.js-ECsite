import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

export async function GET() {
  try {
    const order = await prisma.order.findMany({
      select: {
        id: true,
        order_number: true,
        status: true,
        total: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: true, message: "internal error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const order = await prisma.$transaction(async (prisma) => {
      const token = getUserFromReq(req);

      if (!token) {
        return { ok: false, message: "認証失敗", status: 401 };
      }

      const cartQuantity = await prisma.cartItem.findMany({
        where: {
          user_id: token.userId,
        },
        select: {
          product_id: true,
          quantity: true,
        },
      });

      for (const c of cartQuantity) {
        const productQuantity = await prisma.product.findUnique({
          where: {
            id: c.product_id,
          },
          select: {
            id: true,
            name: true,
            stock: true,
          },
        });

        if (!productQuantity) {
          return {
            ok: false,
            message: `product_id: ${c.product_id}の商品は存在しません`,
            status: 404,
          };
        }

        if (c.quantity > productQuantity.stock) {
          return {
            ok: false,
            message: `商品名: ${productQuantity.name}の商品の在庫が不足しています`,
            status: 404,
          };
        }

        const newStock = productQuantity.stock - c.quantity;

        await prisma.product.update({
          where: {
            id: c.product_id,
          },
          data: {
            stock: newStock,
          },
        });
      }

      const { name, postCode, address, phone, payment } = await req.json();

      const orderNumber = `ORD-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

      const cartItems = await prisma.cartItem.findMany({
        where: {
          user_id: token.userId,
        },
        select: {
          product_id: true,
          quantity: true,
        },
      });

      const subtotal: number[] = [];

      for (const c of cartItems) {
        const productPrice = await prisma.product.findUnique({
          where: {
            id: c.product_id,
          },
          select: {
            price: true,
          },
        });

        if (!productPrice) {
          return {
            ok: false,
            message: `product_id: ${c.product_id}が存在しません`,
            status: 404,
          };
        }
        subtotal.push(productPrice.price * c.quantity);
      }

      const total = subtotal.reduce((pre, cure) => pre + cure, 0);

      const order = await prisma.order.create({
        data: {
          order_number: orderNumber,
          user_id: token.userId,
          status: "pending",
          total: total,
          shipping_address: address,
          payment_method: payment,
        },
      });

      for (const c of cartItems) {
        const price = await prisma.product.findUnique({
          where: {
            id: c.product_id,
          },
          select: {
            price: true,
          },
        });

        if (!price) {
          return { ok: false, message: "商品が存在しません", status: 404 };
        }

        await prisma.orderItem.create({
          data: {
            order_id: order.id,
            product_id: c.product_id,
            quantity: c.quantity,
            price: price.price,
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: {
          user_id: token.userId,
        },
      });

      return { ok: true, message: "注文処理が完了しました" };
    });

    if (order.ok) {
      return NextResponse.json({
        success: true,
        message: order.message,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: order.message,
        },
        { status: order.status }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "注文処理が失敗しました" },
      { status: 500 }
    );
  }
}
