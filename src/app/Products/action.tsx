
"use server";

import type { Product } from "../../types/product";

export async function getProductById(productId: number): Promise<Product> {
  const response = await fetch(
    `https://dummyjson.com/products/${productId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}
