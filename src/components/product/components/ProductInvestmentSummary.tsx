// components/InvestmentSummary.tsx
export default function InvestmentSummary() {
    return (
      <section className="bg-white rounded-3xl p-5 border-gray mb-5 flex flex-col items-center">
        <p className="text-center mb-8 mt-4 leading-loose">
          If you bought a fraction of this asset
          <br></br>
          back in 2019, you would have made
          <span className="block text-3xl font-semibold">€2,406</span>
          160% of net benefice when selling in 2021
        </p>
        <p className="text-sm max-w-lg text-center text-gray-400">
        This compute is based on studies of lorem ipsum dolor sit amet bla bla bla it’s raining today 
        </p>
      </section>
    );
  }
  