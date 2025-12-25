import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getUserFromReq } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // TODO: 商品一覧取得APIの作成
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        stock: true,
        category_id: true,
        category: true,
        seller: true,
        product_images: {
          select: {
            image_url: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      stock: p.stock,
      categoryId: p.category_id,
      category: p.category
        ? { id: p.category.id, name: p.category.name }
        : null,
      seller: p.seller ? { id: p.seller.id, name: p.seller.name } : null,
      imageUrls: p.product_images.map((img) => img.image_url),
    }));

    return NextResponse.json({
      success: true,
      data: {
        products: formatted,
      },
    });
  } catch (error) {
    console.error("GET /products error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // TODO: 商品登録APIの作成
  try {
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

    const dir = "/productImages";

    await prisma.product.create({
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
