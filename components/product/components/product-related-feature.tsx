type ProductCardProps = {
    name: string;
    imageUrl: string;
  };
  
  const RelatedProductCard = ({ name, imageUrl }: ProductCardProps) => {
    return (
      <div className="relative rounded-3xl border border-gray">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-auto object-contain rounded-3xl"
        />
        <div className="absolute top-3 left-3 bg-white p-3 rounded-2xl border-gray">
          <img src="/images/car.svg" width={20} alt="" />
        </div>
      </div>
    );
  };
  
  export default RelatedProductCard;
  