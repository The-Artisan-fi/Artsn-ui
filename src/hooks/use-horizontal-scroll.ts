import { useEffect, useState } from 'react'

export function useHorizontalScroll() {
  const [canScrollVertically, setCanScrollVertically] = useState(false)

  useEffect(() => {
    const sections = ['collectionsCard', 'expertiseCard']
    const sectionFullyScrolled = [false, false]

    function handleScroll() {
      sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId)
        if (section) {
          const isFullyScrolled =
            section.scrollLeft + section.clientWidth >= section.scrollWidth - 1
          sectionFullyScrolled[index] = isFullyScrolled
        }
      })

      setCanScrollVertically(sectionFullyScrolled.every(Boolean))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId)
      if (section) {
        section.addEventListener('scroll', handleScroll, { passive: true })
      }
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId)
        if (section) {
          section.removeEventListener('scroll', handleScroll)
        }
      })
    }
  }, [])

  return canScrollVertically
}
