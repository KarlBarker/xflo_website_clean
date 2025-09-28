"use client"

import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react'

interface FullWidthVideoProps {
  src: string
  className?: string
}

export function FullWidthVideo({ 
  src, 
  className 
}: FullWidthVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Intersection observer to trigger autoplay
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: false
  })

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-play when in view
  useEffect(() => {
    if (videoRef.current && isIntersecting && !isPlaying) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [isIntersecting, isPlaying])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Mobile controls timeout
  useEffect(() => {
    if (!isMobile || !showControls) return
    
    const timeout = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [showControls, isMobile])

  const togglePlay = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    
    const newMutedState = !isMuted
    videoRef.current.muted = newMutedState
    setIsMuted(newMutedState)
  }

  const restartVideo = () => {
    if (!videoRef.current) return
    
    videoRef.current.currentTime = 0
    videoRef.current.play()
  }

  const handleVideoClick = () => {
    if (isMobile) {
      setShowControls(true)
    }
  }

  const handleVideoDoubleClick = () => {
    if (isMobile) {
      togglePlay()
    }
  }

  return (
    <div 
      ref={containerRef}
      className={cn("w-full bg-surface-light py-10 relative", className)}
      data-nav-theme="light"
    >
      <div className="container mx-auto max-w-[1500px] px-6 md:px-8 lg:px-12">
        <div className="relative w-full rounded-md overflow-hidden group">
          <video
            ref={videoRef}
            src={src}
            className="w-full h-auto object-cover"
            muted={isMuted}
            playsInline
            preload="metadata"
            onClick={handleVideoClick}
            onDoubleClick={handleVideoDoubleClick}
          />
          
          {/* Desktop Controls - Show on hover */}
          {!isMobile && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-16 h-16 bg-surface-light/90 hover:bg-surface-light rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-content-primary" />
                  ) : (
                    <Play className="w-8 h-8 text-content-primary ml-1" />
                  )}
                </button>
                
                <button
                  onClick={restartVideo}
                  className="flex items-center justify-center w-16 h-16 bg-surface-light/90 hover:bg-surface-light rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Restart video"
                >
                  <RotateCcw className="w-8 h-8 text-content-primary" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Controls - Show on tap */}
          {isMobile && showControls && (
            <div className="absolute inset-0 bg-black/20 transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-16 h-16 bg-white/90 rounded-full shadow-lg"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-content-primary" />
                  ) : (
                    <Play className="w-8 h-8 text-content-primary ml-1" />
                  )}
                </button>
                
                <button
                  onClick={restartVideo}
                  className="flex items-center justify-center w-16 h-16 bg-white/90 rounded-full shadow-lg"
                  aria-label="Restart video"
                >
                  <RotateCcw className="w-8 h-8 text-content-primary" />
                </button>
              </div>
            </div>
          )}

          {/* Sound Toggle - Always visible in bottom right */}
          <button
            onClick={toggleMute}
            className={cn(
              "absolute bottom-4 right-4 flex items-center justify-center bg-surface-light/90 hover:bg-surface-light rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10",
              isMobile ? "w-10 h-10" : "w-12 h-12"
            )}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className={cn("text-content-primary", isMobile ? "w-4 h-4" : "w-6 h-6")} />
            ) : (
              <Volume2 className={cn("text-content-primary", isMobile ? "w-4 h-4" : "w-6 h-6")} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}