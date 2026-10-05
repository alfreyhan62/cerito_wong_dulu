import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollReveal({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const elements = document.querySelectorAll('header, main > *, footer')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('scroll-reveal-visible')
        observer.unobserve(entry.target)
      }),
      { threshold: 0.12 },
    )

    elements.forEach((element) => element.classList.add('scroll-reveal'))
    const frame = requestAnimationFrame(() => elements.forEach((element) => observer.observe(element)))

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname])

  return children
}
