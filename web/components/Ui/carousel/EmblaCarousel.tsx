import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButtons'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import '@/styles/carousel.css'
import Image from "next/image";
import ProductBorder from "@/public/assets/product-border-bg.png";
import { useRouter }from "next/navigation";

type PropType = {
  slides: any;
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const router = useRouter();
  const { slides, options } = props
  console.log(slides)
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)
  
  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">

          {slides.available.length > 0 && 
            (slides.available.map((item: any, index: number) => (
                <div
                    key={index}
                    className="products__available__slider__item"
                >
                    <Image
                        src={ProductBorder}
                        alt="product border"
                        className="products__available__slider__item__bg"
                    />
                    <div className="item-top">
                        <img
                            // src={Audemar}
                            src={item.image}
                            alt="product"
                            className="item-top-img"
                        />
                    </div>
                    <div className="item-body">
                        <h3 className="heading-6">
                            {item.name} <br/>
                            {item.description}
                        </h3>

                        <div className="item-body-details">
                            <div className="item-body-details-set">
                                <p className="label-5">
                                    FRACTIONS LEFT
                                </p>
                                <p className="label-3">
                                    {item.fractionsLeft}
                                </p>
                            </div>

                            <div className="item-body-details-set">
                                <p className="label-5">
                                    STARTING FROM
                                </p>
                                <p className="label-3">
                                    {item.startingPrice}
                                </p>
                            </div>

                            <div className="item-body-details-set">
                                <p className="label-5">
                                    EARNING POTENTIAL
                                </p>
                                <p className="label-3 green">
                                    {item.earningPotential}
                                </p>
                            </div>
                        </div>

                        <button 
                            className="collect-btn"
                            onClick={() => {
                                router.push(`/product/${item.accountPubkey.toString()}`)
                                // router.push(`/product/1`);
                            }}
                        >
                            <p className="text">COLLECT NOW</p>
                        </button>
                    </div>
                </div>
          )))};
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_: any, index: any) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
              style={{
                color: 'green'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
