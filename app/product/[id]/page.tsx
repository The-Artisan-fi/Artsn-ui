import ProductFeature from "@/components/product/product-feature";

export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductFeature params={params} />;
}