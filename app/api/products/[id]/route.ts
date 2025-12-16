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
    console.log("id =", id);

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

    const image = products.map((i) => ({
      product_id: i.product_id,
      image_url: i.image_url,
      name: i.product.name,
      price: i.product.price,
      description: i.product.description,
      stock: i.product.stock,
    }));
    console.log("products =", image);

    return NextResponse.json({
      success: true,
      data: {
        products: image,
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
