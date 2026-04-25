import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductDetail } from "@/components/product/product-detail";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsFor,
} from "@/services/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(slug, 4),
    getReviewsFor(product.id),
  ]);

  return (
    <Container>
      <ProductDetail product={product} related={related} reviews={reviews} />
    </Container>
  );
}
