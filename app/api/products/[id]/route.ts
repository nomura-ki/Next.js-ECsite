import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromReq } from "@/lib/auth";

interface Params {
  id: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

    const products = await prisma.productImage.findMany({
      where: {
        product_id: id,
      },
      select: {
        product_id: true,
        image_url: true,
        product: {
          select: {
            name: true,
            price: true,
            description: true,
            stock: true,
            category_id: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        products,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "サーバーエラー" },
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

    const order = await prisma.orderItem.findFirst({
      where: {
        product_id: id,
      },
    });

    if (order) {
      return NextResponse.json(
        {
          success: false,
          message: "この商品は注文されているため、削除できません",
        },
        { status: 200 }
      );
    }

    await prisma.productImage.deleteMany({
      where: {
        product_id: id,
      },
    });

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "internal error" },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

    const token = getUserFromReq(req);

    if (!token) {
      return NextResponse.json({ error: "認証失敗" }, { status: 401 });
    }

    const { name, price, description, stock, category_id, checkedValues } =
      await req.json();

    const seller = await prisma.seller.findUnique({
      where: {
        userId: token.userId,
      },
      select: {
        id: true,
      },
    });

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "sellerが存在しません" },
        { status: 404 }
      );
    }

    const productIsExist = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    const imageIsExist = await prisma.productImage.findMany({
      where: {
        id,
      },
    });

    if (!productIsExist) {
      console.error("商品が存在しません");
      return NextResponse.json(
        {
          success: false,
          message: "リソースが見つかりません",
        },
        {
          status: 404,
        }
      );
    } else if (!imageIsExist) {
      console.error("商品の画像が存在しません");
      return NextResponse.json(
        {
          success: false,
          message: "リソースが見つかりません",
        },
        {
          status: 404,
        }
      );
    }

    const dir = "/productImages/other";

    await prisma.productImage.deleteMany({
      where: {
        product_id: id,
      },
    });

    await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        stock,
        category_id,
        seller_id: seller.id,
        product_images: {
          create: checkedValues.map((file: string) => ({
            image_url: `${dir}/${file}`,
          })),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
