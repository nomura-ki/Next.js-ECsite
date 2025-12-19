import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // =====================================
  // 0. まず関連テーブルを全部削除（リセット）
  //    外部キーの関係で子 → 親の順に消す
  // =====================================
  await prisma.$transaction([
    // model 名はプロジェクトに合わせて直してね
    prisma.cartItem.deleteMany(),
    prisma.productImage.deleteMany(), // ProductImage モデルがある前提
    prisma.product.deleteMany(),
    prisma.seller.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("既存データを削除しました");

  // ===============================
  // 1. ユーザー登録（upsert に変更）
  // ===============================
  const rawUsers = [
    { email: "user1@example.com", password: "password123", role: "buyer" },
    { email: "user2@example.com", password: "password123", role: "seller" },
    { email: "user3@example.com", password: "password123", role: "buyer" },
  ];

  const users = [];

  for (const u of rawUsers) {
    const hashedPassword = await hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: hashedPassword,
        role: u.role,
      },
      create: {
        email: u.email,
        password: hashedPassword,
        role: u.role,
      },
    });
    console.log(`ユーザー ${u.email} を登録/更新しました`);
    users.push(user);
  }

  const [, sellerUser1, sellerUser2] = users; // user2, user3

  // ===============================
  // 2. カテゴリ登録（upsert + update）
  // ===============================
  const category1 = await prisma.category.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {
      name: "家電",
    },
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "家電",
    },
  });

  const category2 = await prisma.category.upsert({
    where: { id: "22222222-2222-2222-2222-222222222222" },
    update: {
      name: "書籍",
    },
    create: {
      id: "22222222-2222-2222-2222-222222222222",
      name: "書籍",
    },
  });

  console.log("カテゴリを登録/更新しました");

  // ===============================
  // 3. 販売者登録（upsert + update）
  // ===============================
  const seller1 = await prisma.seller.upsert({
    where: { id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
    update: {
      name: "ショップA",
      userId: sellerUser1.id, // スキーマに合わせて field 名は調整
    },
    create: {
      id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name: "ショップA",
      user: {
        connect: { id: sellerUser1.id },
      },
    },
  });

  const seller2 = await prisma.seller.upsert({
    where: { id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
    update: {
      name: "ショップB",
      userId: sellerUser2.id,
    },
    create: {
      id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "ショップB",
      user: {
        connect: { id: sellerUser2.id },
      },
    },
  });

  console.log("販売者を登録/更新しました");

  // ===============================
  // 4. 商品登録（毎回作り直し）
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
          { image_url: "/productImages/phone/smartphone.jpg", sort_order: 0 },
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
        create: [{ image_url: "/productImages/pc/laptop.jpg", sort_order: 0 }],
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
        create: [{ image_url: "/productImages/book/book.jpg", sort_order: 0 }],
      },
    },
  });

  console.log("商品データの登録が完了しました", {
    product1: product1.id,
    product2: product2.id,
    product3: product3.id,
  });
}

main()
  .catch((e) => {
    console.error("❌ seed 中にエラーが発生しました");
    console.error(e);
    process.exit(1); // ← これが超重要
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
