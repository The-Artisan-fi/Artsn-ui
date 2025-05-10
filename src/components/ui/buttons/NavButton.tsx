'use client'
type Props = {
  onClick: (event: React.MouseEvent) => void
  className?: string
  navbarCollapsed: boolean
}

const NavButton = ({ onClick, className, navbarCollapsed }: Props) => {
  const classes = `bg-secondary h-0.5 duration-200 ${
    navbarCollapsed ? 'absolute' : ''
  }`

  return (
    <button
      className={`${className} group h-7 w-7 transition focus:outline-none`}
      onClick={onClick}
    >
      <div
        className={`relative flex flex-col items-end ${
          navbarCollapsed
            ? 'rotate-90 space-y-0 delay-100 duration-300'
            : 'space-y-1.5 group-hover:space-y-1 group-focus:space-y-1'
        }`}
      >
        <div
          className={`w-7 ${classes} ${navbarCollapsed ? 'rotate-45' : ''}`}
        ></div>
        <div
          className={`${classes} w-6 ${
            navbarCollapsed ? 'opacity-0' : 'opacity-100'
          }`}
        ></div>
        <div
          className={`${classes} ${navbarCollapsed ? 'w-7 -rotate-45' : 'w-5'}`}
        ></div>
      </div>
    </button>
  )
}

export default NavButton
