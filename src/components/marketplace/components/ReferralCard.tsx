import Image from 'next/image'

const ReferralCard = () => {
  return (
    <div className="border-gray relative flex max-w-sm flex-col justify-between overflow-hidden rounded-3xl p-4">
      {/* Car Image in the background */}
      <div
        className="absolute h-full w-96 object-cover opacity-75"
        style={{ right: '-300px' }}
      >
        <Image
          src="/images/car.png"
          alt="Car"
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
      <p></p>

      {/* Content */}
      <div className="relative z-10">
        <h2 className="mb-2 text-xl font-bold">
          Invite your friends & earn your reward!
        </h2>
        <p className="mb-4 text-xs text-gray-500">
          You and your friend will both receive $10 when your friend invests in
          their first Artisan offering.
        </p>
        <button
          className="rounded-2xl bg-black px-4 py-3 text-xs text-white"
          disabled={true}
        >
          Join the Artisan Referral program
        </button>
      </div>

      {/* Learn More link */}
      <div className="mt-4 text-xs text-gray-500">
        <a href="#" className="underline">
          Learn more about the Referral program
        </a>
      </div>
      <div className="absolute inset-0 z-[40] flex items-center justify-center rounded-3xl bg-black/30 backdrop-blur-sm">
        <div className="rounded-lg bg-white/20 px-6 py-3 shadow-lg">
          <p className="text-md font-semibold text-gray-800">
            Feature Coming Soon
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReferralCard
