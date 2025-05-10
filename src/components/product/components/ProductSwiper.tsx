'use client' // Add this line

import { Swiper as SwiperType } from 'swiper' // Import the Swiper type
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper/modules'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { useState, useRef } from 'react'


const ProductSwiper = ({ images }: { images: string[] }) => {
  // Initialize thumbsSwiper as SwiperType | null
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  // Refs for custom navigation buttons
  const prevButtonRef = useRef<HTMLDivElement | null>(null)
  const nextButtonRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="swiper-container relative mb-5">
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Thumbs]} // Use navigation and thumbs modules
        navigation={{
          prevEl: prevButtonRef.current, // Attach ref for prev button
          nextEl: nextButtonRef.current, // Attach ref for next button
        }}
        onSwiper={(swiper) => {
          // Update swiper when it's initialized
          setTimeout(() => {
            if (
              swiper.params &&
              swiper.params.navigation &&
              typeof swiper.params.navigation !== 'boolean'
            ) {
              if (prevButtonRef.current && nextButtonRef.current) {
                swiper.params.navigation.prevEl = prevButtonRef.current
                swiper.params.navigation.nextEl = nextButtonRef.current
                swiper.navigation.update()
              }
            }
          })
        }}
        thumbs={{ swiper: thumbsSwiper }} // Connect the main swiper to the thumbnails
        spaceBetween={10} // Space between slides
        slidesPerView={1} // Only show one main image at a time
        className="main-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="border-gray rounded-2xl p-12">
            <Image 
              src={image} 
              alt={`Watch ${index}`} 
              className="main-image"
              width={500}
              height={500} 
              style={{ width: '100%', height: 'auto' }}
              priority={index === 0} // Prioritize loading the first image
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div
        ref={prevButtonRef}
        className="border-gray absolute z-10 hidden -translate-y-1/2 transform cursor-pointer rounded-2xl bg-white p-3 md:block"
        style={{ top: '36%', left: '-52px' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="#000"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </div>
      <div
        ref={nextButtonRef}
        className="border-gray absolute z-10 hidden -translate-y-1/2 transform cursor-pointer rounded-2xl bg-white p-3 md:block"
        style={{ top: '36%', right: '-52px' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="#000"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </div>

      {/* Thumbnails Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper} // Store the instance of the thumbs swiper in the state
        spaceBetween={15}
        slidesPerView={3} // Show 3 thumbnails at a time
        watchSlidesProgress // Keep track of which thumbnail is active
        className="thumbs-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="border-gray rounded-2xl p-2">
            <Image
              src={image}
              alt={`Thumbnail ${index}`}
              className="thumb-image"
              width={100}
              height={100}
              style={{ width: '100%', height: 'auto' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ProductSwiper
