import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { CartItemWithProduct, formatCartItem } from "@/lib/utils";
import { format } from "path";
import { error } from "console";

export async function GET(req: NextRequest) {
  // TODO: カート取得APIの作成
  try {
    const token = getUserFromReq(req);

    if (!token) {
      console.log("認証失敗");
      return NextResponse.json({ error: "認証失敗" }, { status: 401 });
    }

    console.log("トークン" + token.userId);

    const cart = await prisma.cartItem.findMany({
      where: {
        user_id: token.userId,
      },
      select: {
        id: true,
        user_id: true,
        product_id: true,
        quantity: true,
        created_at: true,
        updated_at: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            product_images: {
              select: {
                image_url: true,
              },
            },
          },
        },
      },
    });

    const cartItems = cart.map(formatCartItem);

    return successResponse({ cartItems });
  } catch (err) {
    return errorResponse("cart GETapi error");
  }
}

export async function POST(req: NextRequest) {
  // TODO: カート登録APIの作成
  try {
    // const cookieStores = await cookies();
    // const token = cookieStores.get("token")?.value;
    // const session = await prisma.session.findUnique({
    //   where: { token },
    // });

    // if (!session) {
    //   return Response.json({ });
    // }

    const token = getUserFromReq(req);

    if (!token) {
      return NextResponse.json({ error: "認証失敗" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    const cart = await prisma.cartItem.upsert({
      where: {
        user_id_product_id: {
          user_id: token.userId,
          product_id: productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        user_id: token.userId,
        product_id: productId,
        quantity: quantity,
      },
    });

    return successResponse({
      cart,
    });
  } catch (err) {
    return errorResponse("error");
  }
}

export async function PUT(req: NextRequest) {
  // TODO: カート更新APIの作成
  try {
    const token = getUserFromReq(req);

    if (!token) {
      console.log("認証失敗");
      return NextResponse.json({ error: "認証失敗" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    const isExist = await prisma.cartItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: token.userId,
          product_id: productId,
        },
      },
    });

    if (!isExist) {
      console.log("カートに商品が存在しません");
      return NextResponse.json(
        { error: "リソースが見つかりません" },
        { status: 404 }
      );
    }

    const cart = await prisma.cartItem.update({
      where: {
        user_id_product_id: {
          user_id: token.userId,
          product_id: productId,
        },
      },
      data: {
        quantity: quantity,
      },
      // include: {
      //   product: {
      //     select: {
      //       id: true,
      //       name: true,
      //       price: true,
      //       stock: true,
      //       product_images: {
      //         select: {
      //           image_url: true,
      //         },
      //       },
      //     },
      //   },
      // },
    });

    // const cartItems = cart.map(formatCartItem);

    return successResponse({ cart });
  } catch {
    return errorResponse("更新に失敗しました");
  }
}

export async function DELETE(req: NextRequest) {
  // TODO: カート削除APIの作成
  try {
    // const raw = await req.text();
    // console.log("raw body:", raw);
    const token = getUserFromReq(req);

    if (!token) {
      console.log("認証失敗");
      return NextResponse.json({ error: "認証失敗" }, { status: 401 });
    }

    // console.log(token.userId);

    const { productId } = await req.json();

    const isExist = await prisma.cartItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: token.userId,
          product_id: productId,
        },
      },
    });

    if (!isExist) {
      console.log("カートに商品が存在しません");
      return NextResponse.json(
        { error: "リソースが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        user_id_product_id: {
          user_id: token.userId,
          product_id: productId,
        },
      },
    });
    console.log("商品をカートから削除しました。");

    return successResponse({ message: "カートから商品を削除しました" });
  } catch (err) {
    return errorResponse("削除に失敗しました！");
  }
}
