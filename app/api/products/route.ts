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
  try {
    const token = getUserFromReq(req);

    if (!token) {
      return NextResponse.json({ errorl: "認証失敗" }, { status: 401 });
    }

    const formData = await req.formData();

    console.log(formData);

    // type File = {
    //   size: number;
    //   type: string;
    //   name: string;
    //   lastModified: number;
    // };

    const files = formData.getAll("file[]");
    const name = String(formData.get("name"));
    const price = Number(formData.get("price"));
    const description = String(formData.get("description"));
    const category_id = String(formData.get("category_id"));
    const stock = Number(formData.get("stock"));

    console.log(files);
    console.log(
      "name",
      name,
      "price",
      price,
      "desc",
      description,
      "catgo",
      category_id,
      "stock",
      stock
    );

    const changeFileFormat = (dir: string) => {
      const fileName: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file instanceof File) {
          fileName.push(`${dir}/${file.name}`);
        } else {
          throw new Error("ファイルの型が違います");
        }
      }
      return fileName;
    };

    const product_images = changeFileFormat("/productImages/other");

    console.log(product_images);

    // const product_images = saveFiles(files, "public/productImages/coffee")

    // const newPrice = Number(price);

    // // const newfiles = saveFiles(files, "public/productImages/coffee");

    const seller = await prisma.seller.findUnique({
      where: {
        userId: token.userId,
      },
      select: {
        id: true,
      },
    });

    if (!seller) {
      return;
    }

    // console.log("price:", price, "typeof:", typeof price);
    // console.log("formData:", formData);
    // // console.log(formData[0]);

    await prisma.product.create({
      data: {
        name,
        price,
        description,
        stock,
        category_id,
        seller_id: seller.id,
        product_images: {
          create: product_images.map((image_url) => ({ image_url })),
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

export async function PUT(req: NextRequest) {
  // TODO: 商品更新APIの作成
}

export async function DELETE(req: NextRequest) {
  // TODO: 商品削除APIの作成
}
