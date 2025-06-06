import { motion, MotionProps } from 'framer-motion'
import { ElementType, HTMLAttributes, ReactNode, createElement } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  className?: string
  children: ReactNode
  id?: string
  animate?: boolean
}

const Wrapper = ({
  children,
  as = 'section',
  className = '',
  id = '',
  animate = true,
  ...rest
}: Props & MotionProps) => {
  if (animate) {
    // @ts-ignore
    const MotionTag = motion.create(as)

    return (
      <MotionTag
        id={id}
        className={`flex flex-col justify-center md:py-0 lg:py-16 ${className}`}
        {...rest}
      >
        {children}
      </MotionTag>
    )
  }

  if (as === 'section') {
    return (
      <motion.section
        id={id}
        className={`flex flex-col justify-center py-4 md:py-32 ${className}`}
        {...rest}
      >
        {children}
      </motion.section>
    )
  }

  return createElement(
    as,
    {
      id,
      className: `flex flex-col justify-center py-24 md:py-32 ${className}`,
      ...rest
    },
    children
  )
}

export default Wrapper
