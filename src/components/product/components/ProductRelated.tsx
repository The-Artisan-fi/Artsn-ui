import Image from 'next/image'

type ProductCardProps = {
  name: string
  imageUrl: string
  icon: string
}

const RelatedProductCard = ({ name, imageUrl, icon }: ProductCardProps) => {
  return (
    <div className="border-gray relative rounded-3xl border">
      <Image
        src={imageUrl}
        alt={name}
        className="h-full w-full rounded-3xl object-contain p-3"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />
      <div className="border-gray absolute left-3 top-3 rounded-2xl bg-white p-3">
        <Image
          src={icon}
          width={20}
          height={20}
          alt="Product icon"
        />
      </div>
    </div>
  )
}

export default RelatedProductCard
