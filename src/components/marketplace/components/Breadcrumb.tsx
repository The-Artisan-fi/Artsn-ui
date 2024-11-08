const Breadcrumb = () => {
    return (
      <section className="bg-black relative w-full h-[200px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/marketplacebreadcrumb.png')" }} // Path to your image
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/70" />
        </div>
  
        {/* Text Content */}
        <div className="relative z-10 flex flex-col justify-end h-full max-w-screen-xl mx-auto px-6 pb-6">
          {/* Title */}
          <h1 className="text-5xl font-bold text-white">Marketplace</h1>
  
          {/* Breadcrumb */}
          <p className="mt-2 text-lg text-gray-300">
            Home {`>`} <span className="text-white">Marketplace</span>
          </p>
        </div>
      </section>
    );
  };
  
  export default Breadcrumb;
  