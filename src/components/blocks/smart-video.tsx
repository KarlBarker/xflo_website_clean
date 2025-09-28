"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { SectionContainer } from './section-container'
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSpacingClasses, type SpacingProps } from '@/lib/spacing-utils'

interface SmartVideoProps extends SpacingProps {
  videoSrc: string
  title?: string
  thumbnail?: string
  description?: string
  aspectRatio?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  pauseOnExit?: boolean
  // Background options
  backgroundType?: 'solid' | 'split'
  backgroundColor?: string
  topBackgroundColor?: string
  bottomBackgroundColor?: string
  splitRatio?: number
}

export function SmartVideo({
  videoSrc,
  title,
  thumbnail,
  description,
  aspectRatio = '16/9',
  autoplay = true,
  muted = true,
  loop = true,
  pauseOnExit = true,
  spacingTop,
  spacingBottom,
  backgroundType = 'solid',
  backgroundColor = 'bg-surface-light',
  topBackgroundColor = 'bg-surface-light',
  bottomBackgroundColor = 'bg-surface-tertiary',
  splitRatio = 30,
}: SmartVideoProps) {
  // All hooks must be at the top before any early returns
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [showControls, setShowControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Use intersection observer to detect when video is in view
  const { ref: containerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5, // Start playing when 50% of video is visible
    triggerOnce: false, // Keep monitoring entrance/exit
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

  // Handle play/pause based on intersection
  useEffect(() => {
    // Don't proceed if no video source
    if (!videoSrc || videoSrc.trim() === '') return;

    const video = videoRef.current
    if (!video || !autoplay) return

    if (isIntersecting) {
      // Video is in view - play it
      video.play().catch(console.error)
    } else if (pauseOnExit) {
      // Video is out of view - pause it
      video.pause()
    }
  }, [isIntersecting, autoplay, pauseOnExit, videoSrc])

  // Mobile controls timeout
  useEffect(() => {
    // Don't proceed if no video source
    if (!videoSrc || videoSrc.trim() === '') return;

    if (!isMobile || !showControls) return

    const timeout = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [showControls, isMobile, videoSrc])

  // Don't render if no video source
  if (!videoSrc || videoSrc.trim() === '') {
    return null;
  }

  // Get spacing classes
  const { topClass, bottomClass } = getSpacingClasses(spacingTop, spacingBottom);

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

  // Determine if this is a YouTube/Vimeo URL or direct video
  const isEmbedUrl = videoSrc?.includes('youtube.com') || 
                   videoSrc?.includes('youtu.be') || 
                   videoSrc?.includes('vimeo.com')

  // Convert YouTube URLs to embed format with autoplay
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}`
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`
    }
    return url
  }

  // Handle background styling
  const renderVideoContent = () => (
    <SectionContainer>
        <div className="flex flex-col gap-6">
          {/* Title */}
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-content-primary text-center">
              {title}
            </h2>
          )}

          {/* Video Container */}
          <div 
            className="relative w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: aspectRatio }}
          >
            {isEmbedUrl ? (
              // Embedded video (YouTube/Vimeo)
              <iframe
                src={getEmbedUrl(videoSrc)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // Direct video file with custom controls
              <div className="relative w-full h-full group">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={videoSrc}
                  poster={thumbnail}
                  muted={isMuted}
                  loop={loop}
                  playsInline
                  preload="metadata"
                  onClick={() => isMobile && setShowControls(true)}
                  onDoubleClick={() => isMobile && togglePlay()}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Desktop Controls - Show on hover */}
                {!isMobile && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <div className="absolute inset-0 flex items-center justify-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="flex items-center justify-center w-16 h-16 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
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
                        className="flex items-center justify-center w-16 h-16 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
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
                    "absolute bottom-4 right-4 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10",
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
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-lg text-content-muted text-center w-text mx-auto">
              {description}
            </p>
          )}
        </div>
    </SectionContainer>
  );

  // Render with background options
  if (backgroundType === 'split') {
    const topHeightPercent = 100 - splitRatio;
    const bottomHeightPercent = splitRatio;
    
    return (
      <div ref={containerRef} className={cn("w-full relative", topClass, bottomClass)}>
        {/* Split background that extends full width */}
        <div className="absolute inset-0">
          {/* Top background */}
          <div 
            className={cn("absolute top-0 left-0 right-0", topBackgroundColor)}
            style={{ height: `${topHeightPercent}%` }}
          ></div>
          {/* Bottom background */}
          <div 
            className={cn("absolute bottom-0 left-0 right-0", bottomBackgroundColor)}
            style={{ height: `${bottomHeightPercent}%` }}
          ></div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10">
          {renderVideoContent()}
        </div>
      </div>
    );
  } else {
    // Solid background
    return (
      <div ref={containerRef} className={cn("w-full", backgroundColor, topClass, bottomClass)}>
        {renderVideoContent()}
      </div>
    );
  }
}