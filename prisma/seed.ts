import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ===============================
  // 1. ユーザー登録（既存コード）
  // ===============================
  const users = [
    { email: "user1@example.com", password: "password123", role: "buyer" },
    { email: "user2@example.com", password: "password123", role: "seller" },
    { email: "user3@example.com", password: "password123", role: "buyer" },
  ];

  for (const u of users) {
    const hashedPassword = await hash(u.password, 10);
    await prisma.user.create({
      data: {
        email: u.email,
        password: hashedPassword,
        role: u.role,
      },
    });
    console.log(`ユーザー ${u.email} を登録しました`);
  }

  // ===============================
  // 2. カテゴリ登録
  // ===============================
  const category1 = await prisma.category.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: { id: "11111111-1111-1111-1111-111111111111", name: "家電" },
  });

  const category2 = await prisma.category.upsert({
    where: { id: "22222222-2222-2222-2222-222222222222" },
    update: {},
    create: { id: "22222222-2222-2222-2222-222222222222", name: "書籍" },
  });

  // ===============================
  // 3. 販売者登録
  // ===============================
  // user2@example.com に紐付ける
  const sellerUser1 = await prisma.user.findUnique({
    where: { email: "user2@example.com" },
  });

  const seller1 = await prisma.seller.upsert({
    where: { id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
    update: {},
    create: {
      id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name: "ショップA",
      user: {
        connect: { id: sellerUser1!.id }, // ← 必須
      },
    },
  });

  const sellerUser2 = await prisma.user.findUnique({
    where: { email: "user5@example.com" },
  });

  const seller2 = await prisma.seller.upsert({
    where: { id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
    update: {},
    create: {
      id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "ショップB",
      user: {
        connect: { id: sellerUser2!.id }, // ← 必須
      },
    },
  });

  // ===============================
  // 4. 商品登録
  // ===============================
  const product1 = await prisma.product.create({
    data: {
      name: "スマートフォン",
      price: 50000,
      description: "最新モデルのスマホです",
      stock: 10,
      category_id: category1.id,
      seller_id: seller1.id,
      product_images: {
        create: [
          { image_url: "https://example.com/smartphone.jpg", sort_order: 0 },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "ノートパソコン",
      price: 120000,
      description: "高性能ノートPC",
      stock: 5,
      category_id: category1.id,
      seller_id: seller2.id,
      product_images: {
        create: [
          { image_url: "https://example.com/laptop.jpg", sort_order: 0 },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "小説本",
      price: 1500,
      description: "人気の小説です",
      stock: 20,
      category_id: category2.id,
      seller_id: seller1.id,
      product_images: {
        create: [{ image_url: "https://example.com/book.jpg", sort_order: 0 }],
      },
    },
  });

  console.log("商品データの登録が完了しました");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
