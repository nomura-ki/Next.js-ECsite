import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyToken, getUserFromReq } from "@/lib/auth";
import { saveFiles } from "@/lib/utils";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
}

export async function PUT(req: NextRequest) {
  // TODO: 商品更新APIの作成
}

export async function DELETE(req: NextRequest) {
  // TODO: 商品削除APIの作成
}
