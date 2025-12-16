import fs from "fs";
import path from "path";
import { CartItem } from "@prisma/client";

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    product_images: { image_url: string }[];
  };
  subtotal: number;
}

export function formatCartItem(cartItem: CartItemWithProduct) {
  return {
    id: cartItem.id,
    product: {
      id: cartItem.product.id,
      name: cartItem.product.name,
      price: cartItem.product.price,
      stock: cartItem.product.stock,
      imageUrl: cartItem.product.product_images[0]?.image_url || "",
    },
    quantity: cartItem.quantity,
    subtotal: cartItem.quantity * Number(cartItem.product.price),
  };
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const pagedItems = items.slice((page - 1) * limit, page * limit);
  return { pagedItems, totalItems, totalPages };
}

export async function saveFiles(
  files: File[],
  uploadDir: string,
  limit = 4
): Promise<string[]> {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const urls: string[] = [];
  for (const [index, file] of files.slice(0, limit).entries()) {
    const fileName = `${index}_${file.name}`;
    fs.writeFileSync(
      path.join(uploadDir, fileName),
      Buffer.from(await file.arrayBuffer())
    );
    urls.push(
      `${uploadDir.replace(process.cwd() + "/public", "")}/${fileName}`
    );
  }
  return urls;
}
