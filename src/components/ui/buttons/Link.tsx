interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
  children: React.ReactNode
  withPadding?: boolean
  onClick?: (event: React.MouseEvent) => void
}

const Link = ({
  href,
  className = '',
  children,
  onClick = () => {},
  withPadding = false,
  ...rest
}: Props) => {
  if (withPadding) {
    return (
      <a
        href={href}
        className={`group ${className}`}
        onClick={onClick}
        {...rest}
      >
        <span className="relative w-fit">
          {children}
          <span className="ease-in-scroll absolute -bottom-0.5 left-0 h-[1px] w-0 bg-accent duration-300 group-hover:w-full group-focus:w-full"></span>
        </span>
      </a>
    )
  }

  return (
    <a
      href={href}
      className={`relative ${className} group`}
      onClick={onClick}
      {...rest}
    >
      {children}
      <span className="ease-in-scroll absolute -bottom-0.5 left-0 h-[1px] w-0 bg-accent duration-300 group-hover:w-full group-focus:w-full group-focus:outline-none"></span>
    </a>
  )
}

export default Link
