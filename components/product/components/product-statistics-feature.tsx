// components/Statistics.tsx
export default function Statistics() {
    return (
      <section className="bg-white rounded-3xl p-5 border-gray mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray border-gray p-5 rounded-3xl">
          <p className="text-gray mb-1 font-normal">Opening price</p>
          <p className="text-3xl font-bold">€104,507</p>
        </div>
        <div className="bg-gray border-gray p-5 rounded-3xl">
          <p className="text-gray mb-1 font-normal">Closing price</p>
          <p className="text-3xl font-bold">€97,631</p>
        </div>
        <div className="bg-gray border-gray p-5 rounded-3xl">
          <p className="text-gray mb-1 font-normal">Minimum price</p>
          <p className="text-3xl font-bold">€97,507</p>
        </div>
        <div className="bg-gray border-gray p-5 rounded-3xl">
          <p className="text-gray mb-1 font-normal">Maximum price</p>
          <p className="text-3xl font-bold">€199,631</p>
        </div>
        <div className="bg-gray border-gray p-5 rounded-3xl">
          <p className="text-gray mb-1 font-normal">Relative</p>
          <p className="text-3xl font-bold">-6.58%</p>
        </div>
        <div className="bg-gray border-gray p-5 rounded-3xl">
          <p className="text-gray mb-1 font-normal">Absolute low</p>
          <p className="text-3xl font-bold">€6,631</p>
        </div>
      </section>
    );
  }
  