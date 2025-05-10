import "@/styles/404.css";
import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="not-found">
      <div className="not-found__header">
        <div className="not-found__hero">
          <h1 className="heading-primary">
            <span className="heading-primary--main">404</span>
            <span className="heading-primary--sub">Page not found</span>
          </h1>
        </div>
        <Link href="/" className="not-found__button">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
