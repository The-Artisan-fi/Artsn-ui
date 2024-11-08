type ProductCardProps = {
    name: string;
    imageUrl: string;
    icon: string;
  };
  
  const RelatedProductCard = ({ name, imageUrl, icon }: ProductCardProps) => {
    return (
      <div className="relative rounded-3xl border border-gray">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain rounded-3xl p-3"
        />
        <div className="absolute top-3 left-3 bg-white p-3 rounded-2xl border-gray">
          <img 
            // src="/images/car.svg" 
            src={icon}
            width={20} alt="" 
          />
        </div>
      </div>
    );
  };
  
  export default RelatedProductCard;
  