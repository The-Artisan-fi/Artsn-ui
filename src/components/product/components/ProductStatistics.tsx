// components/Statistics.tsx
export default function Statistics() {
  return (
    <section className="border-gray mb-5 grid grid-cols-1 gap-4 rounded-3xl bg-white p-5 md:grid-cols-2">
      <div className="bg-gray border-gray rounded-3xl p-5">
        <p className="text-gray mb-1 font-normal">Opening price</p>
        <p className="text-3xl font-bold">€104,507</p>
      </div>
      <div className="bg-gray border-gray rounded-3xl p-5">
        <p className="text-gray mb-1 font-normal">Closing price</p>
        <p className="text-3xl font-bold">€97,631</p>
      </div>
      <div className="bg-gray border-gray rounded-3xl p-5">
        <p className="text-gray mb-1 font-normal">Minimum price</p>
        <p className="text-3xl font-bold">€97,507</p>
      </div>
      <div className="bg-gray border-gray rounded-3xl p-5">
        <p className="text-gray mb-1 font-normal">Maximum price</p>
        <p className="text-3xl font-bold">€199,631</p>
      </div>
      <div className="bg-gray border-gray rounded-3xl p-5">
        <p className="text-gray mb-1 font-normal">Relative</p>
        <p className="text-3xl font-bold">-6.58%</p>
      </div>
      <div className="bg-gray border-gray rounded-3xl p-5">
        <p className="text-gray mb-1 font-normal">Absolute low</p>
        <p className="text-3xl font-bold">€6,631</p>
      </div>
    </section>
  )
}
