import ProductFeature from '@/components/product/Product'

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <ProductFeature productId={id} />
}