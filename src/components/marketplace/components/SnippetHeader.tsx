const SnippetHeader = () => {
  return (
    <section className="transparent relative h-[200px] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/marketplacebreadcrumb.png')" }} // Path to your image
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Text Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-screen-xl flex-col justify-end px-6 pb-6">
        {/* Title */}
        <h1 className="text-5xl font-bold text-black">Marketplace</h1>
      </div>
    </section>
  )
}

export default SnippetHeader
