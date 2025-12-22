import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  id: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  // TODO: 商品詳細取得APIの作成
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
          },
        },
      },
    });

    // const image = products.map((i) => ({
    //   product_id: i.product_id,
    //   image_url: i.image_url,
    //   name: i.product.name,
    //   price: i.product.price,
    //   description: i.product.description,
    //   stock: i.product.stock,
    // }));

    // // for (let i = 0; image.length > i; i++) {
    // //   console.log(image[i].image_url);
    // // }
    // // console.log("image", image);

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
  // TODO: 商品削除APIの作成
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
