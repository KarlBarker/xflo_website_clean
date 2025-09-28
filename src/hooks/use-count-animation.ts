import { useEffect, useState } from 'react'

interface UseCountAnimationOptions {
  start?: number
  end: number
  duration?: number
  trigger: boolean
}

export function useCountAnimation({
  start = 0,
  end,
  duration = 2000,
  trigger
}: UseCountAnimationOptions) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (!trigger) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      const currentCount = Math.floor(start + (end - start) * easeOut)
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end) // Ensure we end exactly at the target
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [start, end, duration, trigger])

  return count
}