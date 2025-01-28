import Product from '@/components/product/Product'

export default function ProductPage({ params }: { params: { id: string } }) {
  return <Product params={params} />
}
