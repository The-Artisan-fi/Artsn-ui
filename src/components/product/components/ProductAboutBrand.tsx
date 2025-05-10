'use client'
import { useState } from 'react'
type AboutBrandProps = {
  info: string
}
export default function AboutBrand({ info }: AboutBrandProps) {
  const [showMore, setShowMore] = useState(false)
  return (
    <section className="border-gray mb-5 flex flex-col rounded-3xl bg-white p-5">
      <h2 className="mb-3 text-xl font-bold">About the Brand</h2>
      <p className="font-normal text-gray-500">
        {showMore ? info : `${info.substring(0, 200)}...`}
      </p>
      <button
        className="font-semibold text-blue-500"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? 'Show less' : 'Show more'}
      </button>
    </section>
  )
}
