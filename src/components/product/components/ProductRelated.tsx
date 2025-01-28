type ProductCardProps = {
  name: string
  imageUrl: string
  icon: string
}

const RelatedProductCard = ({ name, imageUrl, icon }: ProductCardProps) => {
  return (
    <div className="border-gray relative rounded-3xl border">
      <img
        src={imageUrl}
        alt={name}
        className="h-full w-full rounded-3xl object-contain p-3"
      />
      <div className="border-gray absolute left-3 top-3 rounded-2xl bg-white p-3">
        <img
          // src="/images/car.svg"
          src={icon}
          width={20}
          alt=""
        />
      </div>
    </div>
  )
}

export default RelatedProductCard
