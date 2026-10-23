import { ProductDetail } from "../../../pages/ProductDetail";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productId = Number(id);

  return <ProductDetail productId={productId} />;
}
